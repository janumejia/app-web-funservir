const { off } = require("../../../App");
const Neighborhoods = require("../../../model/neighborhoods")
const Location = require("../../../model/locations")
const { nameNeighborhoodRegex, nameAssociatedLocalityRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const addNeighborhoods = async (req, res) => {

    const { name, associatedLocality } = req.body;

    /* Sanitización entradas */
    // 1) Validar el tipo de dato
    if (typeof (name) !== 'string') return res.status(422).json({ message: "Tipo de dato de nombre no es válido" });
    if (typeof (associatedLocality) !== 'string') return res.status(422).json({ message: "Tipo de dato de localidad asociada no es válido" });

    // 2) Validar si cumple con los caracteres permitidos
    const isValidName = nameNeighborhoodRegex.test(name);
    const isValidAssociatedLocality = nameAssociatedLocalityRegex.test(associatedLocality);

    if (isValidName === false) return res.status(422).json({ message: "Formato de nombre no es válido" });
    if (isValidAssociatedLocality === false) return res.status(422).json({ message: "Formato de localidad asociada no es válido" }); // Caso malo
    /* Fin sanitización entradas */

    else { // Caso bueno
        // Comprobamos primero que no exista ese barrio en la bd
        // let doesThisNeighborhoodExist = false;
        Neighborhoods.findOne({ name }).then((element) => {
            if (element) {
                // doesThisNeighborhoodExist = true;
                res.status(409).json({ message: "Ya existe este barrio" })
            } else {
                // Y también comprobamos que la localidad asociada exista
                Location.findOne({ 'name': associatedLocality }).then((element) => {
                    if (element) {
                        const newNeighborhoods = new Neighborhoods({
                            name,
                            associatedLocality
                        })
                        newNeighborhoods.save().then((element) => { // Si todo sale bien...
                            res.status(200).json({ message: "Barrio creado correctamente", element })
                        })
                            .catch((error) => {
                                console.error(error)
                                res.status(500).json({ message: "Error en creación de barrio" })
                            })

                    } else {
                        res.status(404).json({ message: "No existe esta localidad asociada " + associatedLocality })
                    }
                })
            }
        })

    }
}

module.exports = addNeighborhoods