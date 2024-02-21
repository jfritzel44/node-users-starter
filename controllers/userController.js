const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Use the same secret key for JWT as used in the auth process
const secretKey = process.env.JWT_SECRET_KEY;

exports.getUser = async (req, res) => {
    try {
        // Assume the token is passed in the header as 'Authorization: Bearer <token>'
        const token = req.headers.authorization.split(' ')[1]; // Get the token from the header

        console.log("token is");
        console.log(token);
        
        const decoded = jwt.verify(token, secretKey); // Decode the token

        const user = await User.findById(decoded.userId).select('-password'); // Find the user by decoded ID and exclude password from the result
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.json(user); // Send back the user information
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching user information');
    }
};
