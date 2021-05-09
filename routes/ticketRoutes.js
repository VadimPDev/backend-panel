const {Router} = require('express')
const TicketController = require('../controllers/ticketController')
const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

const router = new Router()

router.post('/create',authMiddleware,TicketController.create)
router.get('/getMy',authMiddleware,TicketController.getMy)
router.get('/getAll',authMiddleware,TicketController.getAll)
router.get('/messages/:id',authMiddleware,TicketController.getMessages)


module.exports  = router