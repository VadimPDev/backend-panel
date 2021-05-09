const {Game, User, Location, Server, Version} = require('../models/models')
const axios = require('axios')
const crypto = require('crypto')
const query  = require('samp-query')
const moment = require('moment')
const sampRcon = require('../utils/sampRCON')
const gameDig = require('gamedig')

const generatePassword = (
    length = 10,
    wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
  ) =>
    Array.from(crypto.randomFillSync(new Uint32Array(length)))
      .map((x) => wishlist[x % wishlist.length])
      .join('')


class ServerController {

    async create(req,res){

    }

    async getInfo(req,res){
        const {id} = req.query

        const currentServer = await Server.findOne({
            where:{id},
            include:[
                {model:Location,attributes:['l_ip']},
                {model:Game,attributes:['g_code']}
            ]})

        if(req.user.id === currentServer.userId){
           /*query({host:currentServer.location.l_ip,port:currentServer.s_port},(error,response) =>{
               if(error){
                   console.log(error)
               }else{
                   return res.json(response)
               }
           })*/
           try{
                const info = await gameDig.query({type:currentServer.game.g_code,host:currentServer.location.l_ip,port:currentServer.s_port})
                return res.json(info)
           }catch(e){
                return res.status(403).json({mesasge:'error'})
           }
        }
    }

    async order(req,res){
        try{
            const {game_id,location_id,slots,period,version_id} = req.body

            const currentUser = await User.findOne({where:{id:req.user.id}})

            const currentGame = await Game.findOne({where:{id:game_id}})
            const currentLocation = await Location.findOne({where:{id:location_id}})
            const currentVersion = await Version.findOne({where:{id:version_id}})

            const lastServer = await Server.findOne({where:{gameId:game_id},order: [ [ 'createdAt', 'DESC' ]]})
            let port
            if(lastServer){
                switch(currentGame.g_code){
                    case 'mta':
                        port = lastServer.s_port + 2
                        break
                    default:
                        port = lastServer.s_port + 1
                        break
                }
            }else{
                port = currentGame.g_min_port
            }
            if(port > currentGame.g_max_port){
                return res.json({message:'Нет свободных портов'})
            }
            let price = slots * currentGame.g_price

            switch(period){
                case 30:
                    break
                case 90:
                    price *= 3
                    break
                case 180:
                    price *= 6
                    break
                case 360:
                    price *=12
                    break
            }

            if(currentUser.balance >= price){
                const server = await Server.create({
                    s_slots:slots,
                    s_port:port,
                    s_password:generatePassword(),
                    s_status:0,
                    s_reg:moment(),
                    s_end:moment().add(period,'days'),
                    s_mysql:1,
                    s_rcon:generatePassword(),
                    s_fps:200,
                    userId:currentUser.id,
                    gameId:currentGame.id,
                    locationId:currentLocation.id,
                    versionId:version_id
                })
                const install = await axios.post('http://'+ currentLocation.l_ip + ':'+ currentLocation.l_port + '/install',{
                    id:server.id,
                    password:server.s_password,
                    game_code:currentGame.g_code,
                    version_code:currentVersion.v_code,
                })
                await User.update({balance:currentUser.balance - price},{where:{id:currentUser.id}})
                return res.json({message:'Сервер успешно создан'})
        }
        else{
            return res.status(403).json({message:'недостаточно средств'})
        }

        }catch(e){
            return res.status(403).json({message:'Локация недоступна'})
        }
    }

    async start(req,res){
        const {serverId} = req.body

        const currentServer = await Server.findOne({
            where:{id:serverId},
            include:[
                {model:Location,attributes:['l_ip','l_port']},
                {model:Version,attributes:['v_code']},
                {model:Game,attributes:['g_code']}
            ]})

        if(req.user.id === currentServer.userId){
            let exec = ''
            switch(currentServer.game.g_code){
                case 'samp':
                    exec = './samp03svr'
                    break
                case 'mtasa':
                    exec = './mta-server64'
                    break
                case 'cs16':
                    exec = `./hlds_run -debug -game cstrike -norestart -sys_ticrate 200 +servercfgfile server.cfg +sys_ticrate 200 +map de_dust2 +maxplayers ${currentServer.s_slots} +ip ${currentServer.location.l_ip} +port ${currentServer.s_port} +sv_lan 0`
                    break
                default:
                    exec = ''
            }
            const start = await axios.post('http://'+ currentServer.location.l_ip + ':'+ currentServer.location.l_port + '/start',{
                id:currentServer.id,
                game_code:currentServer.game.g_code,
                version_code:currentServer.version.v_code,
                exec_cmd:exec,
                slots:currentServer.s_slots,
                port:currentServer.s_port,
                rcon:currentServer.s_rcon,
                fps:currentServer.s_fps,
                ip:'10.166.0.2'
            })
            await Server.update({s_status:1},{where:{id:currentServer.id}})
            return res.json({message:'Сервер успешно запущен'})
        }else{
            return res.status(403).json({message:'доступ запрещен'})
        }
    }


    async stop(req,res){
        const {serverId} = req.body

        const currentServer = await Server.findOne({
            where:{id:serverId},
            include:[
                {model:Location,attributes:['l_ip','l_port']},
            ]})

        if(req.user.id === currentServer.userId){
            const start = await axios.post('http://'+ currentServer.location.l_ip + ':'+ currentServer.location.l_port + '/stop',{
                id:currentServer.id,
            })
            await Server.update({s_status:0},{where:{id:currentServer.id}})
            return res.json({message:'Сервер успешно остановлен'})
        }else{
            return res.status(403).json({message:'доступ запрещен'})
        }
    }

    async getAll(req,res) {

    }

    async getUserServers(req,res){
        const servers = await Server.findAll({where:{userId:req.user.id},order: [ [ 'createdAt', 'ASC' ]],include:[{model:Location,attributes:['l_ip','l_name']},{model:Game,attributes:['g_name']}]})

        return res.json(servers)
    }

    async getServerById(req,res){
        const {id} = req.query
        const server = await Server.findOne({where:{id},
            include:[
                {model:Location,attributes:['l_ip','l_name']},
                {model:Game,attributes:['g_name','g_code']},
                {model:Version,attributes:['v_name']}
            ]})
        return res.json(server)
    }

    async cronRun(req,res){
        try{
            const servers = await Server.findAll()
            servers.forEach(async(server) => {
                const now = moment()
                const date_end = moment(server.s_end)
                console.log('now', now)
                console.log('end', date_end)

                if( now > date_end){
                    await Server.update({s_status:3},{where:{id:server.id}})
                }else{
                    console.log(true)
                }
            })
            return res.json({message:'ok'})
        }catch(e){
            return res.status(403).json({message:'error'})
        }

    }

    async getConfig(req,res){
        try{
            const {id} = req.query
            const currentServer = await Server.findOne({
                where:{id},
                include:[
                    {model:Location,attributes:['l_ip','l_port']},
                    {model:Game,attributes:['g_code']}
                ]})

            if(req.user.id === currentServer.userId){
                const config = await axios.post('http://'+ currentServer.location.l_ip + ':'+ currentServer.location.l_port + '/get_config',{
                    id:currentServer.id,
                    game_code:currentServer.game.g_code,
                })
                return res.json({message:'ok',response:config.data.response})

            }
            return res.status(403).json({message:'error server'})
        }catch(e){
            return res.status(403).json({message:e})
        }
    }

    async putConfig(req,res){
        try{
            const {id,config} = req.body
            console.log(req.body)
            const currentServer = await Server.findOne({
                where:{id},
                include:[
                    {model:Location,attributes:['l_ip','l_port']},
                    {model:Game,attributes:['g_code']}
                ]})

            if(req.user.id === currentServer.userId){
                const edit = await axios.post('http://'+ currentServer.location.l_ip + ':'+ currentServer.location.l_port + '/config',{
                    id:currentServer.id,
                    game_code:currentServer.game.g_code,
                    config,
                })
                return res.json({message:'ok',response:edit.data.response})

            }
            return res.status(403).json({message:'error server'})
        }catch(e){
            return res.status(403).json({message:e})
        }
    }

    async rconSend(req,res){
        try{
            const api = new sampRcon('34.91.89.28',3017,'hbsada2131')
            api.call('kick 1 from api',(e,i) =>{
                console.log('log')
            })
            api.close()
            return res.json({message:'ok'})
        }catch(e){
            console.log(e)
            return res.status(403).json({message:e})
        }
    }

    async getConsole(req,res){
        try{
            const {id} = req.query
            const currentServer = await Server.findOne({
                where:{id},
                include:[
                    {model:Location,attributes:['l_ip','l_port']},
                    {model:Game,attributes:['g_code']}
            ]})
            if(req.user.id === currentServer.userId){
                const console = await axios.post('http://'+ currentServer.location.l_ip + ':'+ currentServer.location.l_port + '/console',{
                        id:currentServer.id,
                        game_code:currentServer.game.g_code,
                })
                return res.json({message:'ok',response:console.data.response})

            }
        }catch(e){
            return res.status(403).json({message:e})
        }
    }

}


module.exports = new ServerController()