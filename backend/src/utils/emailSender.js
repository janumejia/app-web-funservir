const nodemailer = require('nodemailer');
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

const sender = (addressee, link) =>{

    const mailOptions = {
        from: "andres_f.quintero_s@uao.edu.co",
        to: addressee,
        subject: "Funservir: Verificación de Email",
        text: `Por favor haga click en el siguiente enlace para verificar su Email en la plataforma de Funservir: ${link}`
    }
    
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log("Email sent:" + info.response);
        }
    });
}

module.exports = sender;