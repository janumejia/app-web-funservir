const crypto = require('crypto');
const sender = require('../../../utils/emailSender');
function generateToken(secret, expirationTime) {
    const data = `${secret}${expirationTime}`;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash;
}

const confirmEmail = (req, res) => {
    const secretKey = 'yourSecretKey';
    const expirationTime = 3600; // Token valid for 1 hour
    const baseURL = 'http://localhost:3000/confirm-email';
    try {
        const token = generateToken(secretKey, expirationTime);
        const email = (req.body)?req.body.email:req;
        const queryParams = `token=${token}&email=${email}&expires=${Date.now() + expirationTime * 1000}`;
        const timeLimitedURL = `${baseURL}?${queryParams}`;
        sender(email, timeLimitedURL);
        res.json(timeLimitedURL);
    } catch (error) {
        res.json({message: error});

    }
}

module.exports = confirmEmail;