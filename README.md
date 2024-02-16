### Login / Register / Forgot Password / Reset Password API Endpoint Implementation with SendGrid ###

Step 1) Create an .env file with the following:

#AUTH Environment Variables
SENDGRID_API_KEY= 
FRONTEND_APP_URL=
JWT_SECRET_KEY=
SALT_ROUNDS=

Step 2) Visit Sendgrid.com and setup a free account.

Step 2) Npm install

Step 3) Npm start

Endpoints:

### Login User ###
/auth/login

### Register A New User ### 
/auth/register

### Reset a Users Password ###
/auth/reset-password

### Get a Forgot Password Link Sent to Email with SendGrid ###
/auth/forgot-password
