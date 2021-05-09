const socketio = require('socket.io')
const {TicketMessage} = require('./models/models')


module.exports = (http) =>{
    const io = socketio(http,{
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        },
        transports: ["websocket"]
    })

    io.on('connection',socket =>{


        socket.on('join',({id})=>{
            socket.join(id)
        })

        socket.on('sendMessage', async({id, t_message,userId})=>{
            const addMessage = await TicketMessage.create({t_message,userId,ticketId:id})
            io.to(id).emit('message', {userId,t_message,id})
        })

        socket.on('exit', (id) => {
            console.log('disconnect')
            socket.leave(id)
          })
    })
}