const InclusiveSites = require("../../../model/site")
const { siteNameRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const uniqueSitenameValidator = async (req, res) => {
    // Entradas: siteName
    const { ...inputs } = req.body;

    // Declaración de matriz de objetos, donde cada objeto representa un campo que se espera en el JSON de entrada
    const dataArray = [
        { input: 'siteName', dataType: 'string', regex: siteNameRegex },
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

    try {
        // Verificar que el nombre de sitio no ha sido previamente registrado
        const site = await InclusiveSites.findOne({ 'name': inputs.siteName });
        if (site && site._id.toString() !== inputs._id) return res.status(409).json({ message: "Ya existe un sitio con ese nombre" });
        else return res.status(200).json({ message: "OK" });
    } catch (error) {
        return res.status(500).json({ message: "Error del servidor" });; // Errores en el servidor
    }
}

module.exports = uniqueSitenameValidator