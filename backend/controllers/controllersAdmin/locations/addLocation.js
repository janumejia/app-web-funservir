const { off } = require("../../../App");
const Location = require("../../../model/locations")
const { nameLocationRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const addLocation = async (req, res) => {
    const { name } = req.body;
    console.log(nameLocationRegex)
    /* Sanitización entradas */
    const isValidName = nameLocationRegex.test(name);

    if(isValidName === false) return res.json({ message: "Formato de nombre no es válido" }); // Caso malo
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
                    .catch((error) => console.error(error)) 
                    
                }
            } else {
                res.json({ message: "Ya existe esta localidad" })
            }
        })
    }
}

module.exports = addLocation