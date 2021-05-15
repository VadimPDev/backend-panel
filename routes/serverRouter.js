const {Router} = require('express')
const ServerController = require('../controllers/serverController')
const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

const router = new Router()

router.post('/order',authMiddleware,ServerController.order)
router.get('/',authMiddleware,ServerController.getAll)
router.get('/all',authMiddleware,ServerController.getUserServers)
router.post('/start',authMiddleware,ServerController.start)
router.post('/stop',authMiddleware,ServerController.stop)
router.get('/my',authMiddleware,ServerController.getServerById)
router.get('/info',authMiddleware,ServerController.getInfo)
router.get('/cron',ServerController.cronRun)
router.get('/config',authMiddleware,ServerController.getConfig)
router.post('/config',authMiddleware,ServerController.putConfig)
router.post('/rcon',authMiddleware,ServerController.rconSend)
router.get('/console',authMiddleware,ServerController.getConsole)


module.exports  = router