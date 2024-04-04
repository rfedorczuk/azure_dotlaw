require('dotenv').config(); 
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 587, false for other ports
  requireTLS: false,
  logger: true,
debug: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
},
tls:{
  rejectUnauthorized:false
}
});

module.exports = transporter;
