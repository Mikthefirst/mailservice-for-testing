import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

const GMAIL_PASS = process.env.GMAIL_PASS;
const EMAIL = process.env.EMAIL;

if (!GMAIL_PASS || !EMAIL) {
    console.error('Missing environment variables: GMAIL_PASS and EMAIL are required');
    process.exit(1);
}

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL,
        pass: GMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    },
    pool: true, 
    maxConnections: 1,
    rateDelta: 1000,
    rateLimit: 5
});


transporter.verify(function(error, success) {
    if (error) {
        console.error('SMTP connection error:', error);
    } else {
        console.log('SMTP server is ready to send messages');
    }
});

export function sendProfileUpdateMail(
    to_mail: string,
    subject: string,
    text: string
) {
    return new Promise((resolve, reject) => {
        let mailOptions = {
            from: EMAIL,
            to: to_mail,
            subject: subject,
            text: text
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                reject(error);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(info);
            }
        });
    });
}

module.exports = { sendProfileUpdateMail };

/*
        sendProfileUpdateMail(
            user.email
        );
*/
