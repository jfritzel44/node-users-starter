var express = require('express');
var router = express.Router();

var authRouter = require('./auth/index'); // Import the authentication router

router.use('/auth', authRouter); // Use the authentication router

module.exports = router;
