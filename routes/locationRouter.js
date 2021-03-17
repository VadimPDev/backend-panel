const {Router} = require('express')
const LocationController = require('../controllers/locationController')
const checkRole = require('../middleware/checkRoleMiddleware')

const router = new Router()

router.post('/create',checkRole('ADMIN'),LocationController.create)
router.get('/',LocationController.getAll)


module.exports  = router