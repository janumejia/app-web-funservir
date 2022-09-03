const User = require("../../model/user")

const deleteUser = async(req, res) =>{

    const {_id} = req.body;
    await User.deleteOne({_id:_id})
    .then((element)=>{
        res.json({ message: "Usuario borrado correctamente", element});
    })
    .catch((error)=>{
        res.json({message: "No se encontro el usuario o no se pudo eliminar"});
    })

}

module.exports = deleteUser