const {Game, User, Location, Server, Version} = require('../models/models')
const axios = require('axios')
const crypto = require('crypto')
const query  = require('samp-query')


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
            ]})

        if(req.user.id === currentServer.userId){
           query({host:currentServer.location.l_ip,port:currentServer.s_port},(error,response) =>{
               if(error){
                   console.log(error)
               }else{
                   return res.json(response)
               }
           })
        }
    }

    async order(req,res){
        const {game_id,location_id,slots,period,version_id} = req.body

        const currentUser = await User.findOne({where:{id:req.user.id}})

        const currentGame = await Game.findOne({where:{id:game_id}})
        const currentLocation = await Location.findOne({where:{id:location_id}})
        const currentVersion = await Version.findOne({where:{id:version_id}})

        const lastServer = await Server.findOne({order: [ [ 'createdAt', 'DESC' ]]})
        let port = currentGame.g_min_port
        if(lastServer){
            port = lastServer.s_port + 1
            if(port > currentGame.g_max_port){
                return res.json({message:'Нет свободных портов'})
            }
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
                s_reg:new Date(2021,3,3),
                s_end:new Date(2021,4,3),
                s_mysql:1,
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
                ip:'10.164.0.3'
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

}


module.exports = new ServerController()