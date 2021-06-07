const { version } = require('uuid')
const {Version,Game} = require('../models/models')

class VersionController {
    
    async create(req,res){
        const {v_name,v_code,gameId} = req.body

        const version = await Version.create({v_name,v_code,gameId})
        return res.json(version)
    }

    async getVersion(req,res) {
        const {gameId} = req.query
        if(gameId === undefined){
            return
        }
        const versions = await Version.findAll({where:{gameId}})
        return res.json(versions)
    }

    async getAll(req,res) {

        try{
            const versions = await Version.findAll({include:[
                {model:Game,attributes:['g_name']}
            ]})
            return res.json(versions)
        }catch(e){
            return res.status(403).json({message:e})
        }
    }

}


module.exports = new VersionController()