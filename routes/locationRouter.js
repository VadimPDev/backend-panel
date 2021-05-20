const {Router} = require('express')
const LocationController = require('../controllers/locationController')
const checkRole = require('../middleware/checkRoleMiddleware')

const router = new Router()

router.post('/',checkRole('ADMIN'),LocationController.create)
router.get('/',LocationController.getAll)
router.get('/all',checkRole('ADMIN'),LocationController.getAllAdmin)
router.put('/:id',checkRole('ADMIN'),LocationController.editLocation)


module.exports  = router