const {Location} = require('../models/models')

class LocationController {

    async create(req,res){
        try{
            const {l_ip,l_name,l_password,l_port,l_cores,l_ram} = req.body

            const location = await Location.create({l_ip,l_name,l_password,l_port,l_cores,l_ram,l_status:1})
            return res.json(location)
        }catch(e){
            return res.status(403).json({message:e})
        }
    }

    async getAll(req,res) {
        try{
            const locations = await Location.findAll({where:{l_status:1}})
            return res.json(locations)
        }catch(e){
            return res.status(403).json({message:e})
        }
    }

    async getAllAdmin(req,res){
        try{
            const locations = await Location.findAll()
            return res.json(locations)
        }catch(e){
            return res.status(403).json({message:e})
        }
    }

    async editLocation(req,res){
        try{
            const {id} = req.params
            const {l_ip,l_name,l_cores,l_ram,l_port} = req.body
            const location = await Location.update({l_ip,l_name,l_cores,l_ram,l_port},{where:{id}})
            return res.json({message:'Изменения сохранены'})
        }catch(e){
            return res.status(403).json({message:e})
        }
    }

}


module.exports = new LocationController()