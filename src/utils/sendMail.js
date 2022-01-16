const nodemailer = require('nodemailer');

const { SMTP_HOST } = process.env;
const { SMTP_PORT } = process.env;
const { SMTP_USERNAME } = process.env;
const { SMTP_PASSWORD } = process.env;

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
            subject,
            html: message,
        });

        return `Message sent: ${mailStatus.messageId}`;
    } catch (err) {
        console.error(err.message);
        throw new Error(`An error occured in: sendMail function. Error: ${err.message}`);
    }
};

// sendMail method uses mailtrap.io for testing development.

module.exports = sendMail;
