const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host:"srv76.niagahoster.com",
    port:465,
    secure:true,
    auth: {
        user: 'noreply@siapptn.com',
        pass: 'fikar123'
    }, 
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter;