const Location = require("../../../model/locations")
const { _idMongooseRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const deleteLocation = async(req, res) =>{

    const {_id} = req.body;

    /* Sanitización entradas */
    const isValid_id = _idMongooseRegex.test(_id);

    if(isValid_id == false) return res.json({ message: "Formato de _id no es válido" }); // Caso malo
    /* Fin sanitización entradas */

    await Location.deleteOne({_id:_id})
    .then((element)=>{
        if (element.deletedCount !== 0) res.json({ message: "Localidad borrada correctamente"});
        else res.json({message: "No se encontro la localidad o no se pudo eliminar"});
    })
    .catch((error)=>{
        res.json({message: "No se encontro la localidad o no se pudo eliminar"});
    })

}

module.exports = deleteLocation