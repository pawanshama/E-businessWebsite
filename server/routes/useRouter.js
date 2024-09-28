const userctrl = require('../controllers/userControl');
const router = require('express').Router()
const auth  = require('../middleware/auth')

router.post('/register',userctrl.register)
router.post('/login',userctrl.login);
router.get('/logout',userctrl.logout);
router.post('/refreshtoken',userctrl.refreshtoken)
router.get('/info', auth , userctrl.getUser)

module.exports = router;