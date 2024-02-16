require("dotenv").config();

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendResponse = require('../utils/responseUtil');
const sgMail = require("@sendgrid/mail");
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);

const secretKey = process.env.JWT_SECRET_KEY; // Use a strong, environment-specific secret
const fromEmail = process.env.FORGOT_PW_FROM_EMAIL; // The email the user receives the forgot password link from, needs to be configured as this through SendGrid

/**
 * POST /auth/forgot-password
 * Body: { email: string }
 * Sends a password reset link to the user's email if the user exists.
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User with given email does not exist");
    }

    // Create a reset token and expiry
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 3600000; // 1 hour from now

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = tokenExpiry;
    await user.save();

    // Define the base URL for your front-end application
    const frontendAppURL = process.env.FRONTEND_APP_URL; // e.g., 'https://www.instamusictools.com'

    // Send email to user with reset link
    const resetPasswordLink = `${frontendAppURL}/reset-password?token=${resetToken}`;
    const emailSubject = "Reset Your Password";
    const emailText = `Please click on the following link to reset your password: ${resetPasswordLink}`;
    const emailHtml = `<p>Please click on the link below to reset your password:</p><p><a href="${resetPasswordLink}">${resetPasswordLink}</a></p>`;

    try {
      await sendEmail(
        user.email,
        fromEmail,
        emailSubject,
        emailText,
        emailHtml
      );
      res.send("Password reset link sent to email.");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error sending password reset email.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error resetting password");
  }
};

/**
 * POST /auth/reset-password
 * Body: { token: string, newPassword: string }
 * Allows a user to reset their password using a valid token.
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Checks if token has not expired
    });

    if (!user) {
      return res
        .status(400)
        .send("Password reset token is invalid or has expired");
    }

    // Set the new password and clear the reset token fields
    user.password = await bcrypt.hash(newPassword, saltRounds);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.send("Password has been reset successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error resetting password");
  }
};

/**
 * POST /auth/login
 * Body: { username: string, password: string }
 * Description: Authenticates a user and returns a JWT if successful.
 */
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // User authenticated, generate JWT
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        secretKey,
        { expiresIn: "1h" } // Token expires in 1 hour
      );
      res.json({ message: "User logged in successfully", token });
    } else {
      // Authentication failed
      res.status(401).send("Invalid username or password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in user");
  }
};

/**
 * POST /auth/register
 * Body: { username: string, password: string, email: string }
 * Description: Registers a new user and checks if email and username already exist.
 */
exports.registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if the email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return sendResponse(res, 409, false, "Email already exists");
    }

    // Check if the username already exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return sendResponse(res, 409, false, "Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();

    // On successful registration
    sendResponse(res, 201, true, "User registered");
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, "Error registering new user");
  }
};

async function sendEmail(to, from, subject, text, html) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY); 

  const msg = {
    to,
    from,
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent");
  } catch (error) {
    console.error("Error sending email:", error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
}
