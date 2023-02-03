require('dotenv').config({ path: '.env' })
const Neighborhoods = require("../../../model/neighborhoods");
const Location = require("../../../model/locations")
const { _idMongooseRegex, nameNeighborhoodRegex, nameAssociatedLocalityRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const editNeighborhoods = async (req, res) => {
    const { _id, name, associatedLocality } = req.body;
    
    /* Sanitización entradas */
    // 1) Validar el tipo de dato
    if(typeof(_id) !== 'string') return res.status(422).json({ message: "Tipo de dato de _id no es válido" });
    if(typeof(name) !== 'string') return res.status(422).json({ message: "Tipo de dato de nombre no es válido" });
    if(typeof(associatedLocality) !== 'string') return res.status(422).json({ message: "Tipo de dato de localidad asociada no es válido" });

    // 2) Validar si cumple con los caracteres permitidos 
    const isValid_id = _idMongooseRegex.test(_id);
    const isValidName = nameNeighborhoodRegex.test(name);
    const isValidAssociatedLocality = nameAssociatedLocalityRegex.test(associatedLocality);
    
    if (isValidName === false) return res.json({ message: "Formato de nombre no es válido" });
    if (isValidAssociatedLocality === false) return res.json({ message: "Formato de localidad asociada no es válido" });
    if (isValid_id === false) return res.json({ message: "Formato de _id no es válido" }); // Caso malo
    /* Fin sanitización entradas */

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
    else if (doesThisNameExist && !isTheSameNameForThis_id) return res.status(409).json({ message: "Ya existe este barrio" });
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