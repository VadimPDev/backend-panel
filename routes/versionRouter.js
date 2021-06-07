const {Router} = require('express')
const VersionController = require('../controllers/versionController')
const checkRole = require('../middleware/checkRoleMiddleware')

const router = new Router()

router.post('/',checkRole('ADMIN'),VersionController.create)
router.get('/',VersionController.getVersion)
router.get('/all',VersionController.getAll)


module.exports  = router