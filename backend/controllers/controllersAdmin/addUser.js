const User = require("../../model/user")

const addUser = async (req, res) => {

    const {name, email, password, edad, sexo, direccion, discapacidad, tutor, fundacion, userType} = req.body;
    User.findOne({email}).then((element)=>{
        if(!element){
            if(name && email && edad && sexo && direccion && tutor && fundacion && userType){

                const newUser = new User({
                    name, email, password, edad, sexo, direccion, discapacidad, tutor, fundacion, userType
                })
                newUser.save().then((element) => { // Si todo sale bien...
                    res.json({ message: "Usuario creado correctamente", element})
                })
                .catch((error) => console.error(error))
            }
        }else{
            res.json({ message: "Error"})
        }
    })
}

module.exports = addUser