const { version } = require('uuid')
const {Version} = require('../models/models')

class VersionController {
    
    async create(req,res){
        const {v_name,v_code,gameId} = req.body

        const version = await Version.create({v_name,v_code,gameId})
        return res.json(version)
    }

    async getAll(req,res) {
        const {gameId} = req.query
        if(gameId === undefined){
            return
        }
        const versions = await Version.findAll({where:{gameId}})
        return res.json(versions)
    }

}


module.exports = new VersionController()