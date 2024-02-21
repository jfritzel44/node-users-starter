var express = require('express');
var router = express.Router();

var authRouter = require('./auth/authRoutes'); 
var userRouter = require('./user/userRoutes'); 

router.use('/auth', authRouter); 
router.use('/userInfo', userRouter); 

module.exports = router;
