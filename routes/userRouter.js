const {Router} = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const UserController = require('../controllers/userController')

const router = new Router()

router.post('/registration',UserController.registration)
router.post('/login',UserController.login)
router.get('/check',authMiddleware,UserController.check)


module.exports  = router