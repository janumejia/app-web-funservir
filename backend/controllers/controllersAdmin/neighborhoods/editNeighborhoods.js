require('dotenv').config({ path: '.env' })
const Neighborhoods = require("../../../model/neighborhoods");
const Location = require("../../../model/locations")

// const delay = ms => new Promise(res => setTimeout(res, ms));

const editNeighborhoods = async (req, res) => {
    console.log("req.body:")
    console.log(req.body)
    const { _id, name, associatedLocality } = req.body;
    
    // Sanitizar entrada:
    // Sanitización entrada nombre y localidad asociada
    const pattern_id = /^[0-9a-fA-F]{24}$/;
    const patternNameAndAssociatedLocality = /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,100}$/;

    const isValid_id = pattern_id.test(_id);
    const isValidName = patternNameAndAssociatedLocality.test(name);
    const isValidAssociatedLocality = patternNameAndAssociatedLocality.test(associatedLocality);
    
    if(isValidName === false || isValidAssociatedLocality === false ||  isValid_id === false) return res.json({ message: "Formato no válido" }); // Caso malo
    
    // Consulta con el _id ingresado:
    let doesThis_idExist = false;
    let isTheSameNameForThis_id = false;
    let isTheSameAssociatedLocalityForThis_id = false;
    await Neighborhoods.findOne({ _id }).then((element) => {
        if (element){
            doesThis_idExist = true;

            // Comprobamos si los campos de nombre y localidad asociada ingresados por el usuario son iguales a los que tiene actualmente
            if(element.name === name) isTheSameNameForThis_id = true;
            if(element.associatedLocality === associatedLocality) isTheSameAssociatedLocalityForThis_id = true;
        }
    })

    if(isTheSameNameForThis_id && isTheSameAssociatedLocalityForThis_id ) return res.json({ message: "Los valores ingresados son iguales a los actuales" });
    
    let doesThisNameExist = false;
    await Neighborhoods.findOne({ name }).then((element) => {
        if (element) doesThisNameExist = true;
    })

    let doesThisAssociatedLocalityExist = false;
    await Location.findOne({ 'name': associatedLocality }).then((element) => {
        if (element) doesThisAssociatedLocalityExist = true;
    })    


    // Retorna si existe el nombre, si no existe la localidad o si no existe el _id:
    if (!doesThis_idExist) return res.json({ message: "No existe el _id" });
    else if (doesThisNameExist && !isTheSameNameForThis_id) return res.json({ message: "Ya existe este barrio" });
    else if(!doesThisAssociatedLocalityExist) return res.json({ message: "No existe la localidad asociada" });

    // Edita el registro después de pasar los filtros
    const query = { _id: _id };
    const update = {
        name: name,
        associatedLocality: associatedLocality
    }
    await Neighborhoods.findByIdAndUpdate(query, update);
    let ans = await Neighborhoods.findOne(query);
    res.json({message: "Barrio actualizado correctamente", ans});

}

module.exports = editNeighborhoods