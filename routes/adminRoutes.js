const {Router} = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const UserController = require('../controllers/userController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

const router = new Router()

router.get('/users',checkRoleMiddleware('ADMIN'), UserController.getAllUsers)
router.post('/users/edit',checkRoleMiddleware('ADMIN'),UserController.edit)


module.exports  = router