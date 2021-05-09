const { Ticket, TicketMessage } = require("../models/models")
class TicketController {
    async create(req,res){
        try{
            const {name,text} = req.body
            const id = req.user.id
            const ticket = await Ticket.create({t_name:name,t_status:1,userId:id})
            await TicketMessage.create({t_message:text,userId:id,ticketId:ticket.id})
            return res.json({message:'Запрос успешно создан'})
        }catch(e){
            return res.status(403).json({mesasge:e})
        }
    }

    async getMy(req,res){
        try{
            const tickets = await Ticket.findAll({where:{userId:req.user.id}})
            return res.json(tickets)
        }catch(e){
            return res.status(403).json({mesasge:e})
        }
    }

    async getAll(req,res){
        try{
            const tickets = await Ticket.findAll()
            return res.json(tickets)
        }catch(e){
            return res.status(403).json({mesasge:e})
        }
    }

    async getMessages(req,res){
        try{
            const {id} = req.params
            const messages = await TicketMessage.findAll({where:{ticketId:id}})
            return res.json(messages)
        }catch(e){
            return res.status(403).json({mesasge:e})
        }
    }
}

module.exports = new TicketController()