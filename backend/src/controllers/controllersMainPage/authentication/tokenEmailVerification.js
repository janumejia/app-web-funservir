const User = require("../../../model/user");
require('dotenv').config({ path: '.env' })
const crypto = require('crypto');

function generateToken(secret, expirationTime) {
    const data = `${secret}${expirationTime}`;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash;
}

const tokenEmailVerification = async (req, res) => {
    const {token, email, expires} = req.body;
    const expirationTime = 3600; // Token válido por 1 hora
    const currentTime = Date.now();
    const expirationTimestamp = parseInt(expires);
    const secretKey = `${process.env.MAIL_SALT_TOKEN}${expirationTimestamp}${email}`;
    const isValidToken = token === generateToken(secretKey, expirationTime);
    
    if (isValidToken && currentTime < expirationTimestamp) {
        
        const query = { email: email };
        const update = {emailConfirmed: true};
        await User.findOneAndUpdate(query, update);
        res.json({message: "Success"});
    } else {
        
        res.json({ message: "Error" });
    }

}

module.exports = tokenEmailVerification;