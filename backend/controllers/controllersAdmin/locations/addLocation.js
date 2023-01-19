const { off } = require("../../../App");
const Location = require("../../../model/locations")
const { nameLocationRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const addLocation = async (req, res) => {
    const { name } = req.body;

    /* Sanitización entradas */
    // 1) Validar el tipo de dato
    if(typeof(name) !== 'string') return res.status(422).json({ message: "Tipo de dato de nombre no es válido" });

    // 2) Validar si cumple con los caracteres permitidos
    const isValidName = nameLocationRegex.test(name);

    if(isValidName === false) return res.status(422).json({ message: "Formato de nombre no es válido" }); // Código 422 significa -> 422: “Unprocessable Entity.” The client request contains semantic errors, and the server can’t process it. https://kinsta.com/blog/http-status-codes/
    /* Fin sanitización entradas */

    else { // Caso bueno
        Location.findOne({ name }).then((element) => {
            if (!element) {
                if (name) {
                    const newLocation = new Location({
                        name
                    })
                    newLocation.save().then((element) => { // Si todo sale bien...
                        res.status(200).json({ message: "Localidad creada correctamente", element })
                    })
                    .catch((error) => {
                        console.error(error)
                        res.status(500).json({ message: "Error al guardar"})
                    }) 
                    
                }
            } else {
                res.status(409).json({ message: "Ya existe esta localidad" })
            }
        })
    }
}

module.exports = addLocation