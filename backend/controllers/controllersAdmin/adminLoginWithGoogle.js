const bcrypt = require("bcryptjs")
const User = require("../../model/user")
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require('google-auth-library');

// Implementación basada en: https://livefiredev.com/in-depth-guide-sign-in-with-google-in-a-react-js-application/
const AdminLogin = async (req, res) =>{

    const { clientId, credential } = req.body;

    console.log(clientId, " ", credential)
    
    async function verify(client_id, jwtToken) {
        const client = new OAuth2Client(client_id);
        // Call the verifyIdToken to
        // varify and decode it
        const ticket = await client.verifyIdToken({
            idToken: jwtToken,
            audience: client_id,
        });
        // Get the JSON with all the user info
        const payload = ticket.getPayload();
        // This is a JSON object that contains
        // all the user info
        return payload;
    }

    let verificationResult = verify(clientId, credential)
    res.json({message: verificationResult});

}

module.exports = AdminLogin