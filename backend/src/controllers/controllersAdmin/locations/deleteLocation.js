const Location = require("../../../model/locations")
const { _idMongooseRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const deleteLocation = async(req, res) =>{

    const {_id} = req.body;

    /* Sanitización entradas */
    // 1) Validar el tipo de dato
    if(typeof(_id) !== 'string') return res.status(422).json({ message: "Tipo de dato de _id no es válido" });

    // 2) Validar si cumple con los caracteres permitidos 
    const isValid_id = _idMongooseRegex.test(_id);

    if(isValid_id == false) return res.status(422).json({ message: "Formato de _id no es válido" }); // Caso malo
    /* Fin sanitización entradas */

    await Location.deleteOne({_id:_id})
    .then((element)=>{
        if (element.deletedCount !== 0) res.status(200).json({ message: "Localidad borrada correctamente"});
        else res.status(404).json({message: "No se encontró la localidad"});
    })
    .catch((error)=>{
        res.status(500).json({message: "No se pudo eliminar"});
    })
}

module.exports = deleteLocation