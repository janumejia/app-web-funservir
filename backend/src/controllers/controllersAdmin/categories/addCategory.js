const Categories = require("../../../model/categories");
const { nameCategoryRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const addCategory = async (req, res) => {

    const { ...inputs } = req.body;

    // Cuando la entrada excede le limite permitido, el JSON de la petición llega vacío en este punto
    if (Object.keys(inputs).length === 0) return res.status(413).json({ message: `El tamaño de la información enviada excede los límites permitidos.` });

    // Definición de las variables que esperamos
    const dataArray = [
        { input: 'name', dataType: 'string', regex: nameCategoryRegex },
    ]

    /* Sanitización entradas */
    // Validar el tipo de dato y si cumple con los caracteres permitidos
    for (var i = 0; i < dataArray.length; i++) {
        if (typeof (inputs[dataArray[i].input]) !== dataArray[i].dataType) return res.status(422).json({ message: `Tipo de dato de ${dataArray[i].input} no es válido` });
        if (dataArray[i].regex.test(inputs[dataArray[i].input]) === false) return res.status(422).json({ message: `Formato de ${dataArray[i].input} no es válido` });
    }
    // /* Fin sanitización entradas */


    Categories.findOne({ 'name': inputs.name }).then((element) => {
        if (!element) {
            if (inputs.name) {
                const newCategory = new Categories({
                    name: inputs.name
                })
                newCategory.save().then((element) => { // Si todo sale bien...
                    res.json({ message: "Categoría creada correctamente", element })
                })
                    .catch((error) => {
                        console.error(error)
                        res.status(500).json({ message: "Error al agregar categoría" })
                    })
            }
        } else {
            res.status(409).json({ message: "Ya existe otra categoría con ese nombre" })
        }
    })
}

module.exports = addCategory