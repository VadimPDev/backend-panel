require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path  = require('path')
const models = require('./models/models')
const http = require('http')
const sequelize = require('./db')
const router = require('./routes/index')
const createSocket = require('./socket')

const PORT = process.env.PORT | 5000

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname,'static')))
app.use('/api',router)

createSocket(server)

const start = async() =>{
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        server.listen(PORT,()=> console.log('Server started on port ',PORT))
    }catch(e){
        console.log(e)
    }
}


start()