const crypto = require('crypto');
require('dotenv').config({ path: '.env' })
const sender = require('../../../utils/emailSender');
function generateToken(secret, expirationTime) {
    const data = `${secret}${expirationTime}`;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash;
}

const confirmEmail = (req, res) => {
    try {
        const email = (req.body)?req.body.email:req;
        const expirationTime = 3600; // Token válido por 1 hora
        const expirationTimestamp = Date.now() + expirationTime * 1000;
        const baseURL = 'http://localhost:3000/confirm-email';
        const secretKey = `${process.env.MAIL_SALT_TOKEN}${expirationTimestamp}${email}`;
        const token = generateToken(secretKey, expirationTime);
        const queryParams = `token=${token}&email=${email}&expires=${expirationTimestamp}`;
        const timeLimitedURL = `${baseURL}?${queryParams}`;
        sender(email, timeLimitedURL);
        res.json(timeLimitedURL);
    } catch (error) {
        res?.json({message: error});

    }
}

module.exports = confirmEmail;