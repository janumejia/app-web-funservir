const bcrypt = require("bcryptjs")
const User = require("../../model/user")
const jwt = require("jsonwebtoken")

const AdminLogin = async (req, res) =>{

    const {email, password} = req.body;
    User.findOne({email}).then((user)=>{
        if(user && (user.userType === 'A' || user.userType === 'Administrador')){ // En la anterior versión está con A sólito
            bcrypt.compare(password, user.password)
            .then((isCorrect)=>{
                if(isCorrect){
                    const {id, name, userType} = user

                    const data = {
                        id,
                        name,
                        userType,
                    };

                    const token = jwt.sign(data, process.env.JWT_SECRET, {
                        expiresIn: '10h'
                    });
                    
                    res.cookie('token', token, { 
                        httpOnly: true,
                        secure: process.env.NODE_ENV !== "development",
                    });

                    res.json({
                        message: "Usuario autenticado correctamente",
                        user:{token}
                    })
                }else{
                    res.json({ message: "Correo o contraseña incorrecta", user:{}})
                }
            })
        }else{
            res.json({ message: "Correo o contraseña incorrecta", user:{}})
        }
    })

}

module.exports = AdminLogin