const Neighborhoods = require("../../../model/neighborhoods")
const { _idMongooseRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const deleteNeighborhoods = async(req, res) =>{

    const {_id} = req.body;

    /* Sanitizar entradas */
    // 1) Validar el tipo de dato
    if(typeof(_id) !== 'string') return res.status(422).json({ message: "Tipo de dato de _id no es válido" });

    // 2) Validar si cumple con los caracteres permitidos 
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