const Neighborhoods = require("../../../model/neighborhoods")
const { _idMongooseRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const deleteNeighborhoods = async(req, res) =>{

    const {_id} = req.body;

    // Sanitizar entrada:
    const pattern_id = /^[0-9a-fA-F]{24}$/;

    const isValid_id = pattern_id.test(_id);

    if(isValid_id == false) return res.json({ message: "Formato no válido" }); // Caso malo


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