const bcrypt = require("bcryptjs")
const User = require("../../model/user")
const jwt = require("jsonwebtoken")

const AdminLogin = async (req, res) =>{

    const {email, password} = req.body;

    User.findOne({email}).then((user)=>{
        if(user && user.userType === 'A'){
            bcrypt.compare(password, user.password)
            .then((isCorrect)=>{
                if(isCorrect){
                    const {id, name} = user

                    const data = {
                        id,
                        name
                    };

                    const token = jwt.sign(data, process.env.JWT_SECRET, {
                        expiresIn: '1m'
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