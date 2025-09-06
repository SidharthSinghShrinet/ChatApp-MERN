const {Router} = require('express');
const { sendMessage, getMessage } = require('../controllers/message.controller');
const authenticate = require('../middlewares/auth.middlewares');
const router = Router();

router.post('/send/:id',authenticate,sendMessage);
router.get('/:id',authenticate,getMessage);

module.exports = router;