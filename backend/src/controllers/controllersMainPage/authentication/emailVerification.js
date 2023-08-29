const crypto = require('crypto');

function generateToken(secret, expirationTime) {
    const currentTime = Date.now();
    const data = `${secret}${currentTime}${expirationTime}`;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash;
}

const confirmEmail = (req,res) => {
    const secretKey = 'yourSecretKey';
    const expirationTime = 3600; // Token valid for 1 hour
    const baseURL = 'http://localhost:3000/confirm-email';
    try {
        const token = generateToken(secretKey, expirationTime);
        const queryParams = `token=${token}&expires=${Date.now() + expirationTime * 1000}`;
        const timeLimitedURL = `${baseURL}?${queryParams}`;
        res.json(timeLimitedURL);
        console.log(timeLimitedURL)
    } catch (error) {
        res.status(500).json({ message: "Error" });

    }
}

module.exports = confirmEmail