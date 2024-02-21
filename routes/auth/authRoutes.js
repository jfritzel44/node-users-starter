const express = require("express");
const router = express.Router();
const { forgotPassword, resetPassword, loginUser, registerUser } = require("../../controllers/authController");

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/login", loginUser);
router.post("/register", registerUser);

module.exports = router;
