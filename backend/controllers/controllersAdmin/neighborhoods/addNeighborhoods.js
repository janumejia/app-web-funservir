const { off } = require("../../../App");
const Neighborhoods = require("../../../model/neighborhoods")
const Location = require("../../../model/locations")
const addNeighborhoods = async (req, res) => {

    const { name, associatedLocality } = req.body;

    // Sanitización entrada nombre y localidad asociada
    const patternNameAndAssociatedLocality = /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,100}$/;
    const isValidName = patternNameAndAssociatedLocality.test(name);
    const isValidAssociatedLocality = patternNameAndAssociatedLocality.test(associatedLocality);

    if (isValidName === false || isValidAssociatedLocality === false) return res.json({ message: "Formato no válido" }); // Caso malo
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