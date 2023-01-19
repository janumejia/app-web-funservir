const User = require("../../../model/user")
const { _idMongooseRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const deleteUser = async(req, res) =>{

    const {_id} = req.body;
    /* Sanitización entradas */
    // 1) Validar el tipo de dato
    if(typeof(_id) !== 'string') return res.status(422).json({ message: "Tipo de dato de _id no es válido" });

    // 2) Validar si cumple con los caracteres permitidos 
    const isValid_id = _idMongooseRegex.test(_id);

    if(isValid_id == false) return res.status(422).json({ message: "Formato de _id no es válido" }); // Caso malo
    /* Fin sanitización entradas */

    await User.deleteOne({_id:_id})
    .then((element)=>{
        res.status(200).json({ message: "Usuario borrado correctamente", element});
    })
    .catch((error)=>{
        res.status(400).json({message: "No se encontró el usuario o no se pudo eliminar"});
    })

}

module.exports = deleteUser