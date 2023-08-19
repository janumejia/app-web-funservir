require('dotenv').config({ path: '.env' })  // Para traer las variables de entorno
const jwt = require("jsonwebtoken");
const { ...regex } = require("../../../regex") // Importación de patrones de Regex
const Users = require("../../../model/user");

const tokenStatus = async (req, res) => {
    
    try {
        const { ...inputs } = req.decodedDataInToken;

        // Cuando la entrada excede le limite permitido, el JSON de la petición llega vacío en este punto
        if (Object.keys(inputs).length === 0) return res.status(413).json({ message: `El tamaño de la información enviada excede los límites permitidos.` });

        // Declaración de matriz de objetos, donde cada objeto representa un campo que se espera en el JSON de entrada
        const dataArray = [
            { input: '_id', dataType: 'string', regex: regex._idMongooseRegex },
        ]

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

        let userInfo = await Users.find({ '_id': inputs._id }, ' -password -__v -userType').populate({path:'associatedSites', populate : {path:'inclusiveElements', model:'InclusiveElements'}}).populate({ path: 'favorites', model: 'Site', populate: { path: 'inclusiveElements', model: 'InclusiveElements' }});
        
        if (userInfo) {
            // Para remover el elemento _id en la respuesta del JSON, ya que se debe utilizar el _id de la cookie de sesión
            // let objAux = { ...userInfo[0]._doc };
            // delete objAux["_id"];
            // userInfo[0] = objAux;

            return res.status(200).json({ message: 'Token válido', data: userInfo });
        }
        else res.status(404).json({ message: "No se encontró el usuario"})

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Error al consultar información del usuario' });
    }

}

module.exports = tokenStatus