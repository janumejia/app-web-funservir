require('dotenv').config({ path: '.env' })  // Para traer las variables de entorno
const bcrypt = require("bcryptjs") // Toca bcryptjs porque la version pura de javascript, en cambio bcrypt require de python
const User = require("../../../model/user")
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    const { email, password } = req.body
    //Poner tambien que popule las imagenes
    User.findOne({ email }).populate({
        path: 'associatedSites',
        populate: {
            path: 'inclusiveElements',
            model: 'InclusiveElements'
        }
    })
        .populate({
            path: 'favorites',
            model: 'Site',
            populate: {
                path: 'inclusiveElements',
                model: 'InclusiveElements'
            }
        })
        .then(async user => {
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
                                _id: user._id,
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

                            // Para obtener el dominio
                            // const regexToGetDomain = new RegExp(/^(http[s]?:\/\/)(.*?)(?:\:.*)?$/);
                            // let matchedDomain = req.headers["origin"].match(regexToGetDomain);
                            // matchedDomain = matchedDomain[1].concat(matchedDomain[2])

                            // ver tipo de proyecto
                            const secureCookie = process.env.BACKEND_NODE_ENV === "development" ? false : true;
                            const sameSiteValue = process.env.BACKEND_NODE_ENV === "development" ? "Strict" : "None";

                            res
                                .cookie("AWFS-token", token, // Basado en: https://medium.com/@zahedialfurquan20/using-cookies-to-store-jwt-for-authentication-and-authorization-in-a-mern-stack-app-a58d7a5d6b6e
                                    {
                                        httpOnly: true, // True = no puede ser accedida a traves de JavaScript
                                        secure: secureCookie, // True = solo puede se transportada por HTTPS, no http sin SSL
                                        sameSite: sameSiteValue, // La cookie solo podrá ser enviada al destino donde se genero lo cookie
                                        // domain: matchedDomain,
                                        maxAge: 7 * 24 * 60 * 60 * 1000, // La cookie durará 7 días (en milisegundos) 
                                    })
                                .json({
                                    message: "Usuario autenticado correctamente",
                                    data: data
                                })


                        } else {
                            const fakeToken = jwt.sign({ _id: "fakeId", userType: "fakeuUserType" }, process.env.BACKEND_JWT_SECRET, { expiresIn: 86400 });
                            res.status(401).json({ message: "Correo y/o contraseña incorrecta", user: {} })
                        }
                    })
            } else {
                // Para evitar enumeración de usuarios debido al tiempo de respuesta
                await User.findOne({}).populate({ path: 'associatedSites', populate: { path: 'inclusiveElements', model: 'InclusiveElements' } });

                await bcrypt.compare("fakepassword", "$2b$10$abcdefghijklmnopqrstuv") // Simula comparación de la contraseña
                const fakeToken = jwt.sign({ _id: "fakeId", userType: "fakeuUserType" }, process.env.BACKEND_JWT_SECRET, { expiresIn: 86400 });

                res.status(401).json({ message: "Correo y/o contraseña incorrecta", user: {} })
            }
        })
}


module.exports = login