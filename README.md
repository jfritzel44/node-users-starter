# User Authentication API with SendGrid

This project implements user authentication in a Node.js application, including features such as login, registration, password reset, and sending emails using SendGrid.

## Getting Started

Follow these steps to set up the project environment and run the application.

### Prerequisites

- Node.js installed on your machine
- SendGrid account for sending emails

### Configuration

1. Create an `.env` file in the project root directory and add the following environment variables:

   ```plaintext
   # Authentication and Environment Variables
   SENDGRID_API_KEY=<your_sendgrid_api_key>
   FRONTEND_APP_URL=<your_frontend_app_url>
   JWT_SECRET_KEY=<your_jwt_secret_key>
   SALT_ROUNDS=<your_salt_rounds_for_bcrypt>
   ```

2. Set up a free account on [SendGrid](https://sendgrid.com) and obtain an API key.

3. Install the necessary Node.js packages:

   ```bash
   npm install
   ```

4. Start the application:

   ```bash
   npm start
   ```

## API Endpoints

Here are the available endpoints for user authentication:

- **Login User**: `POST /auth/login`
- **Register a New User**: `POST /auth/register`
- **Reset a User's Password**: `POST /auth/reset-password`
- **Send a Forgot Password Link via Email**: `POST /auth/forgot-password`

## Code Overview

The main functionality of the authentication process is handled by several functions:

- `exports.forgotPassword`: Generates a password reset token and sends a reset link to the user's email.
- `exports.resetPassword`: Allows a user to reset their password using a valid token.
- `exports.loginUser`: Authenticates a user and returns a JWT for accessing protected routes.
- `exports.registerUser`: Registers a new user with a username, password, and email.

## Contributing

Contributions to improve the authentication API are welcome. Please follow the standard GitHub pull request process to propose your changes.

---

Feel free to customize the sections according to your specific project details and requirements. This structured format should help users understand how to set up and use your application more effectively.
