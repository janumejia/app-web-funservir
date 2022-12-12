const { off } = require("../../App");
const Location = require("../../model/locations")
const addLocation = async (req, res) => {

    const { name } = req.body;
    
    // Sanitización entrada nombre
    const patternName = /^([A-Za-z1-9ñÑáéíóú ]){1,100}$/;
    const isValidName = patternName.test(name);

    if(isValidName == false) return res.json({ message: "Formato no válido" }); // Caso malo
    else { // Caso bueno
        Location.findOne({ name }).then((element) => {
            if (!element) {
                if (name) {
                    const newLocation = new Location({
                        name
                    })
                    newLocation.save().then((element) => { // Si todo sale bien...
                        res.json({ message: "Localidad creada correctamente", element })
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