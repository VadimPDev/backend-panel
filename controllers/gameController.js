const {Game} = require('../models/models')

class GameController {
    
    async create(req,res){
        const {g_name,g_code,g_min_port,g_max_port,g_min_slots,g_max_slots,g_price} = req.body

        const game = await Game.create({g_name,g_code,g_min_port,g_max_port,g_min_slots,g_max_slots,g_status:1,g_price})
        return res.json(game)
    }

    async getAll(req,res) {
        const games = await Game.findAll()
        return res.json(games)
    }

}


module.exports = new GameController()