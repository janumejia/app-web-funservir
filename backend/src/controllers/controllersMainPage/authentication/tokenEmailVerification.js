const User = require("../../../model/user");
const crypto = require('crypto');

function generateToken(secret, expirationTime) {
    const data = `${secret}${expirationTime}`;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash;
}

const tokenEmailVerification = async (req, res) => {
    const {token, email, expires} = req.body;
    const secretKey = 'yourSecretKey';
    const expirationTime = 3600;
    const currentTime = Date.now();
    const expirationTimestamp = parseInt(expires);
    const isValidToken = token === generateToken(secretKey, expirationTime);
    
    if (isValidToken && currentTime < expirationTimestamp) {
        
        const query = { email: email };
        const update = {emailConfirmed: true};
        await User.findOneAndUpdate(query, update);
    } else {
        
        res.status(500).json({ message: "Error" })
    }

}

module.exports = tokenEmailVerification;