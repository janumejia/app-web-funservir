const Neighborhoods = require("../../../model/neighborhoods")
const { _idMongooseRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const deleteNeighborhoods = async(req, res) =>{

    const {_id} = req.body;

    /* Sanitizar entradas */
    const isValid_id = _idMongooseRegex.test(_id);

    if(isValid_id == false) return res.json({ message: "Formato de _id no es válido" }); // Caso malo
    /* Fin sanitización entradas */

    await Neighborhoods.deleteOne({_id:_id})
    .then((element)=>{
        if (element.deletedCount !== 0) res.json({ message: "Barrio borrado correctamente"});
        else res.json({message: "No se encontró el barrio o no se pudo eliminar"});
    })
    .catch((error)=>{
        res.json({message: "No se encontró el barrio o no se pudo eliminar"});
    })

}

module.exports = deleteNeighborhoods