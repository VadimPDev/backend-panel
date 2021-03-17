const {Location} = require('../models/models')

class LocationController {
    
    async create(req,res){
        const {l_ip,l_name,l_password,l_port,l_cores,l_ram} = req.body

        const location = await Location.create({l_ip,l_name,l_password,l_port,l_cores,l_ram,l_status:1})
        return res.json(location)
    }

    async getAll(req,res) {
        const locations = await Location.findAll()
        return res.json(locations)
    }

}


module.exports = new LocationController()