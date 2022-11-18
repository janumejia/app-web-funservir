const Elements = require("../../model/inclusiveElements.js");

const deleteElement = async(req, res) =>{

    const {_id} = req.body;
    await Elements.deleteOne({_id:_id})
    .then((element)=>{
        res.json({ message: "Usuario borrado correctamente", element});
    })
    .catch((error)=>{
        res.json({message: "No se encontro el usuario o no se pudo eliminar"});
    })

}

module.exports = deleteElement