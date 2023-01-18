require('dotenv').config({ path: '.env' })
const Location = require("../../../model/locations");
const { _idMongooseRegex, nameLocationRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const editLocation = async (req, res) => {
    const { _id, name } = req.body;
    
    /* Sanitización entradas */
    const isValid_id = _idMongooseRegex.test(_id);
    const isValidName = nameLocationRegex.test(name);

    if(isValid_id == false) return res.json({ message: "Formato de _id no es válido" });
    if(isValidName == false) return res.json({ message: "Formato de nombre no es válido" }); // Caso malo
    /* Fin sanitización entradas */
    
    let doesThisNameExist = false;
    await Location.findOne({ name }).then((element) => {
        if (element) doesThisNameExist = true;
    })

    let doesThis_idExist = false;
    await Location.findOne({ _id }).then((element) => {
        if (element) doesThis_idExist = true;
    })

    // Retorna Error si existe el nombre o si no existe el _id:
    if(doesThisNameExist) return res.json({ message: "Ya existe esta localidad" });
    else if (!doesThis_idExist) return res.json({ message: "No existe el _id" });

    // Edita el registro después de pasar los filtros
    const query = { _id: _id };
    const update = {
        name: name,
    }
    await Location.findByIdAndUpdate(query, update);
    let ans = await Location.findOne(query);
    res.json({message: "Localidad actualizada correctamente", ans});

}

module.exports = editLocation