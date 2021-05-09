const {Router} = require('express')
const UserRouter = require('./userRouter')
const GameRouter = require('./gameRouter')
const LocationRouter = require('./locationRouter')
const ServerRouter = require('./serverRouter')
const AdminRouter = require('./adminRoutes')
const VersionRouter = require('./versionRouter')
const TicketRouter = require('./ticketRoutes')

const router = new Router()

router.use('/user',UserRouter)
router.use('/game',GameRouter)
router.use('/location',LocationRouter)
router.use('/server',ServerRouter)
router.use('/version',VersionRouter)
router.use('/admin', AdminRouter)
router.use('/ticket',TicketRouter)







module.exports = router