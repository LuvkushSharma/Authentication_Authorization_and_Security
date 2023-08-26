const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

    // Step-1️⃣ : Create a transporter

    // transporter is a service that we gonna use for sending the email
    
    // Passing options in the transporter
    const transporter = nodemailer.createTransport({

        // service: 'Gmail',

        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,

        // Store auth related details in the config.env file
        auth: {

             user:process.env.EMAIL_USERNAME,
             pass: process.env.EMAIL_PASSWORD
        }

    });

    // Step-2️⃣ : Define the email options
    /*

    const mailOptions = {

        from: '"Luvkush Sharma"  <luvkush@gmail.com>',

        to: options.email,
        subject: options.subject,
        text: options.message,

    }

    */

    const mailOptions = {

        from: '"Keshav Dubey"  <keshav@gmail.com>',

        to: options.email,
        subject: options.subject,
        text: options.message,

    }

    // Step-3️⃣ : Actually send sthe email
    transporter.sendMail(mailOptions , (error, info) => {

        if (error) {
            return console.log(error);
        }

        console.log('Message sent: %s', info.messageId);
    });

};


module.exports = sendEmail;