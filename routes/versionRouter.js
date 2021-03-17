const {Router} = require('express')
const VersionController = require('../controllers/versionController')
const checkRole = require('../middleware/checkRoleMiddleware')

const router = new Router()

router.post('/create',checkRole('ADMIN'),VersionController.create)
router.get('/',VersionController.getAll)


module.exports  = router