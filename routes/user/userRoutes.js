const express = require('express');
const router = express.Router();
const { getUser } = require('../../controllers/userController');
const authenticateToken = require('../../middleware/authenticateToken');

// Define the route for fetching user information, applying the validateToken middleware
// to ensure that only authenticated requests can access this endpoint.
router.get('/', authenticateToken, getUser);

module.exports = router;
