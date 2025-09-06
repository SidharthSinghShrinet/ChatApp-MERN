const {Router} = require('express');
const { registerUser, loginUser, logout, otherUsers } = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth.middlewares');
const router = Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/logout',logout);
router.get('/others',authenticate,otherUsers);

module.exports = router;