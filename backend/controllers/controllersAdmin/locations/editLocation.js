require('dotenv').config({ path: '.env' })
const Location = require("../../../model/locations");

// const delay = ms => new Promise(res => setTimeout(res, ms));

const editLocation = async (req, res) => {
    const { _id, name } = req.body;
    
    // Sanitizar entrada:
    const pattern_id = /^[0-9a-fA-F]{24}$/;
    const patternName = /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,100}$/;
    
    const isValid_id = pattern_id.test(_id);
    const isValidName = patternName.test(name);

    if(isValid_id == false || isValidName == false) return res.json({ message: "Formato no válido" }); // Caso malo
    
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