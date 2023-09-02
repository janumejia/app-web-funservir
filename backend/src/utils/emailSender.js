const nodemailer = require('nodemailer');
const fs = require('fs');
const ejs = require('ejs');
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "andres_f.quintero_s@uao.edu.co",
        pass: "nqqsmkkekuukhozj"
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sender = (addressee, link) => {

    fs.readFile('src/utils/email.ejs', 'utf-8', (err, templateData) => {
        if (err) {
            console.error('Error reading template file:', err);
            return;
        }
        // Render the EJS template with dynamic data
        const renderedEmail = ejs.render(templateData, {
            emailLink: link
        });
        const mailOptions = {
            from: "andres_f.quintero_s@uao.edu.co",
            to: addressee,
            subject: "Funservir: Verificación de Email",
            html: renderedEmail,
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent:" + info.response);
            }
        });
    });
}

module.exports = sender;