require('dotenv').config({ path: '.env' })
const Categories = require("../../../model/categories");
const { _idMongooseRegex, nameCategoryRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const editCategory = async (req, res) => {
    const { ...inputs } = req.body;
    
    // Definición de las variables que esperamos
    const dataArray = [
        { input: '_id', dataType: 'string', regex: _idMongooseRegex },
        { input: 'name', dataType: 'string', regex: nameCategoryRegex },
    ]

    /* Sanitización entradas */
    // Validar el tipo de dato y si cumple con los caracteres permitidos
    for(var i = 0; i < dataArray.length; i++){
        if (typeof (inputs[dataArray[i].input]) !== dataArray[i].dataType) return res.status(422).json({ message: `Tipo de dato de ${dataArray[i].input} no es válido` });
        if (dataArray[i].regex.test(inputs[dataArray[i].input]) === false) return res.status(422).json({ message: `Formato de ${dataArray[i].input} no es válido` });
    }
    // /* Fin sanitización entradas */

    let doesThisNameExist = false;
    await Categories.findOne({ name: inputs.name }).then((element) => {
        if (element) doesThisNameExist = true;
    })

    let doesThis_idExist = false;
    await Categories.findOne({ _id: inputs._id }).then((element) => {
        if (element) doesThis_idExist = true;
    })

    // Retorna Error si existe el nombre o si no existe el _id:
    if(doesThisNameExist) return res.status(409).json({ message: "Ya existe una categoría con este nombre" });
    if (!doesThis_idExist) return res.status(404).json({ message: "No existe el _id" });

    // Edita el registro después de pasar los filtros
    const query = { _id: inputs._id };
    const update = {
        name: inputs.name,
    }
    await Categories.findByIdAndUpdate(query, update);
    let ans = await Categories.findOne(query);
    res.status(200).json({message: "Categoría actualizada correctamente", ans});

}

module.exports = editCategory