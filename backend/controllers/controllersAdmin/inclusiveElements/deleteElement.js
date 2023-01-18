const Elements = require("../../../model/inclusiveElements.js");
const cloudinary = require("../../../middlewares/cloudinary");
const { _idMongooseRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const deleteElement = async(req, res) =>{

    const {_id } = req.body;
    /* Sanitización entradas */
    // 1) Validar el tipo de dato
    if(typeof(_id) !== 'string') return res.status(422).json({ message: "Tipo de dato de _id no es válido" });

    // 2) Validar si cumple con los caracteres permitidos 
    const isValid_id = _idMongooseRegex.test(_id);

    if(isValid_id == false) return res.json({ message: "Formato de _id no es válido" }); // Caso malo
    /* Fin sanitización entradas */


    await Elements.deleteOne({_id:_id})
    .then((element)=>{
        cloudinary.uploader.destroy(`inclusiveElements/${resto.name}`);
        res.json({ message: "Usuario borrado correctamente", element});
    })
    .catch((error)=>{
        res.json({message: "No se encontro el usuario o no se pudo eliminar"});
    })

}

module.exports = deleteElement