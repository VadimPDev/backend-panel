const {Router} = require('express')
const UserRouter = require('./userRouter')
const GameRouter = require('./gameRouter')
const LocationRouter = require('./locationRouter')
const ServerRouter = require('./serverRouter')
const VersionRouter = require('./versionRouter')

const router = new Router()

router.use('/user',UserRouter)
router.use('/game',GameRouter)
router.use('/location',LocationRouter)
router.use('/server',ServerRouter)
router.use('/version',VersionRouter)







module.exports = router