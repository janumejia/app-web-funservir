const InclusiveSites = require("../../../model/site")
const { _idMongooseRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const deleteInclusiveSites = async (req, res) => {

    // Entradas: _id
    const { ...inputs } = req.body;

    // Definición de las variables que esperamos
    const dataArray = [
        { input: '_id', dataType: 'string', regex: _idMongooseRegex },
    ]

    /* Sanitización entradas */
    // Validar el tipo de dato y si cumple con los caracteres permitidos
    // for (var i = 0; i < dataArray.length; i++) {
    //     if (typeof (inputs[dataArray[i].input]) !== dataArray[i].dataType) return res.status(422).json({ message: `Tipo de dato de ${dataArray[i].input} no es válido` });
    //     if (dataArray[i].regex.test(inputs[dataArray[i].input]) === false) return res.status(422).json({ message: `Formato de ${dataArray[i].input} no es válido` });
    // }
    /* Fin sanitización entradas */

    await InclusiveSites.deleteOne({ _id: inputs._id })
        .then((element) => {
            if (element.deletedCount !== 0) res.status(200).json({ message: "Sitio inclusivo borrado correctamente" });
            else res.status(400).json({ message: "No se encontró el sitio inclusivo" });
        })
        .catch((error) => {
            res.status(500).json({ message: "No se pudo eliminar" });
        })
}

module.exports = deleteInclusiveSites