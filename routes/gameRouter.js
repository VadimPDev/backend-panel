const {Router} = require('express')
const GameController = require('../controllers/gameController')
const checkRole = require('../middleware/checkRoleMiddleware')

const router = new Router()

router.post('/create',checkRole('ADMIN'),GameController.create)
router.get('/',GameController.getAll)


module.exports  = router