const InclusiveSites = require("../../../model/site")
const User = require("../../../model/user")
const { _idMongooseRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas
const { ObjectId } = require('mongodb');

const deleteInclusiveSites = async (req, res) => {

    // Entradas: _id
    const { ...inputs } = req.body;

    // Definición de las variables que esperamos
    const dataArray = [
        { input: '_id', dataType: 'string', regex: _idMongooseRegex },
    ]

    /* Sanitización entradas */
    // Función validateInput que toma tres argumentos: el valor del campo, el tipo de datos que se espera y la expresión regular que se utilizará para validar el valor.
    // La función verifica si el valor del campo es válido según los criterios especificados y devuelve true o false.
    const validateInput = (input, dataName, dataType, regex) => {
        if (dataType === 'string') {
            return typeof input === 'string' && regex.test(input);
        }
        if (dataType === 'array') {
            return Array.isArray(input) && input.every(element => regex.test(element)); // Método every para iterar sobre cada uno de los elementos del arreglo y comprobar si cada elemento cumple con la expresión regular
        }
        if (dataType === 'object') {
            return typeof input === 'object' && input !== null &&
                dataArray.every(({ input: requiredInput, properties, regex: requiredRegex }) => {
                    if (requiredInput !== dataName) return true;
                    return properties.every(prop => input.hasOwnProperty(prop) && requiredRegex.test(input[prop]));
                });
        }
        return false;
    };

    // El ciclo recorre cada elemento de la matriz dataArray y llama a validateInput con el valor correspondiente del campo del objeto JSON, el tipo de datos y la expresión regular.
    // Si el valor del campo no es válido según los criterios especificados, se devuelve un mensaje de error.
    for (const { input, dataType, regex } of dataArray) {
        const inputValue = inputs[input];
        if (!validateInput(inputValue, input, dataType, regex)) {
            return res.status(422).json({ message: `El valor de ${input} no es válido` });
        }
    }
    /* Fin sanitización entradas */

    InclusiveSites.deleteOne({ _id: inputs._id })
        .then( async (element) => {
            if (element.deletedCount !== 0){
                
                // Buscamos los usuarios que tienen este sitio inclusivo asociado y lo actualizamos (lo desasociamos)
                await User.updateMany(
                    // Filtro para seleccionar los documentos que contienen el _id en el arreglo sitios
                    { "associatedSites": { $elemMatch: { $eq: ObjectId(inputs._id) } } },
                    // Operador $pull para eliminar el objeto que contiene el _id del arreglo sitios
                    { $pull: { associatedSites: ObjectId(inputs._id) } }
                    );
                
                res.status(200).json({ message: "Sitio inclusivo borrado correctamente" });
                    
            }
            else res.status(400).json({ message: "No se encontró el sitio inclusivo" });
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ message: "No se pudo eliminar" });
        })
}

module.exports = deleteInclusiveSites