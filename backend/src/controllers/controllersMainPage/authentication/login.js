require('dotenv').config({ path: '.env' })  // Para traer las variables de entorno
const bcrypt = require("bcryptjs") // Toca bcryptjs porque la version pura de javascript, en cambio bcrypt require de python
const User = require("../../../model/user")
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    const { email, password } = req.body
<<<<<<< HEAD
    
    User.findOne({ email }).then(async (user) => {
=======
    //Poner tambien que popule las imagenes
    User.findOne({ email }).populate({path:'associatedSites', populate : {path:'inclusiveElements', model:'InclusiveElements'}}).then((user) => {
>>>>>>> 0a533b2 (lista de sitios, debido al cambio de ref se debe hacer el cambio en el portal)
        if (user) {
            /* Vamos a comparar la contraseña del body con la contraseña que está en la BD */
            bcrypt.compare(password, user.password) // Retorna un booleano sobre si coincide la contraseña
                .then((isCorrect) => {
                    if (isCorrect) {
                        const { _id, userType } = user
                        
                        const token = jwt.sign({ _id, userType }, process.env.BACKEND_JWT_SECRET, { //revisar el método "sign"
                            expiresIn: 86400 /* 24hs */,
                        });
                        const data = {
                            name: user.name,
                            lastName: user.lastName,
                            email: user.email,
                            dateOfBirth: user.dateOfBirth,
                            gender: user.gender,
                            address: user.address,
                            condition: user.condition,
                            isCaregiver: user.isCaregiver,
                            institution: user.institution,
                            associatedSites: user.associatedSites,
                            profilePicture: user.profilePicture,
                            describeYourself: user.describeYourself,
                            socialInstagram: user.socialInstagram,
                            socialFacebook: user.socialFacebook,
                            socialTwitter: user.socialTwitter,
                            coverPicture: user.coverPicture,
                        };
                        
                        // Cambiar después de sameSite: "none" a sameSite: "strict"
                        res
                        .cookie("AWFS-token", token, { httpOnly: true, sameSite: "Strict", domain: "localhost", hostOnly: false }) // Enviamos el token como una cookie, y con la propiedad httpOnly. Basado en: https://medium.com/@zahedialfurquan20/using-cookies-to-store-jwt-for-authentication-and-authorization-in-a-mern-stack-app-a58d7a5d6b6e
                        .json({
                            message: "Usuario autenticado correctamente",
                            data: data
                        })

                    } else {
                        const fakeToken = jwt.sign({ _id: "fakeId", userType: "fakeuUserType" }, process.env.BACKEND_JWT_SECRET, { expiresIn: 86400 }); 
                        res.status(401).json({ message: "Correo y/o contraseña incorrecta", user:{}})
                    }
                })
        }else{
            // No usar esto. Solo es para evitar enumeración de usuarios debido al tiempo de respuesta
            await bcrypt.compare("fakepassword", "$2b$10$abcdefghijklmnopqrstuv") // Simula comparación de la contraseña
            const fakeToken = jwt.sign({ _id: "fakeId", userType: "fakeuUserType" }, process.env.BACKEND_JWT_SECRET, { expiresIn: 86400 }); 

            res.status(401).json({ message: "Correo y/o contraseña incorrecta", user:{}})
        }
    })
}


module.exports = login