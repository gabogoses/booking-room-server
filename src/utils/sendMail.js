'use strict';

const nodemailer = require('nodemailer');

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USERNAME = process.env.SMTP_USERNAME;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

const sendMail = async ({ recipient, subject, message }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            auth: {
                user: SMTP_USERNAME,
                pass: SMTP_PASSWORD,
            },
        });

        const mailStatus = await transporter.sendMail({
            from: 'no-reply@booking-room-app.com',
            to: recipient,
            subject: subject,
            html: message,
        });

        return `Message sent: ${mailStatus.messageId}`;
    } catch (err) {
        console.error(err);
        throw new Error(`An error occured in sendMail function. Error: ${err.message}`);
    }
};

// sendMail feature uses MailTrap for test development.

module.exports = sendMail;
