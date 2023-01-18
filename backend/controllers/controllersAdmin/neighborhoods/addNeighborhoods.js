const { off } = require("../../../App");
const Neighborhoods = require("../../../model/neighborhoods")
const Location = require("../../../model/locations")
const { nameNeighborhoodRegex, nameAssociatedLocalityRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const addNeighborhoods = async (req, res) => {

    const { name, associatedLocality } = req.body;

    /* Sanitización entradas */
    const isValidName = nameNeighborhoodRegex.test(name);
    const isValidAssociatedLocality = nameAssociatedLocalityRegex.test(associatedLocality);

    if (isValidName === false) return res.json({ message: "Formato de nombre no es válido" });
    if (isValidAssociatedLocality === false) return res.json({ message: "Formato de localidad asociada no es válido" }); // Caso malo
    /* Fin sanitización entradas */
    
    else { // Caso bueno
        // Comprobamos primero que no exista ese barrio en la bd
        // let doesThisNeighborhoodExist = false;
        Neighborhoods.findOne({ name }).then((element) => {
            if (element) {
                // doesThisNeighborhoodExist = true;
                res.json({ message: "Ya existe este barrio" })
            } else {
                // Y también comprobamos que la localidad asociada exista
                Location.findOne({ 'name': associatedLocality }).then((element) => {
                    if (element) {
                        const newNeighborhoods = new Neighborhoods({
                            name,
                            associatedLocality
                        })
                        newNeighborhoods.save().then((element) => { // Si todo sale bien...
                            res.json({ message: "Barrio creado correctamente", element })
                        })
                            .catch((error) => {
                                console.error(error)
                                res.json({ message: "Error en creación de barrio" })
                            })

                    } else {
                        res.json({ message: "No existe esta localidad asociada " + associatedLocality })
                    }
                })
            }
        })

    }
}

module.exports = addNeighborhoods