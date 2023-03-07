const cloudinary = require("../../../middlewares/cloudinary");
const Neighborhoods = require("../../../model/neighborhoods")
const InclusiveSites = require("../../../model/site")
const User = require("../../../model/user")
const { ObjectId } = require('mongodb');

const { nameRegex, descriptionRegex, categoryRegex, contactNumberRegex, localityRegex, neighborhoodRegex, inclusiveElementsRegex } = require("../../../regex") // Importación de patrones de Regex

const addInclusiveSites = async (req, res) => {

    // Entradas: name, description, category, contactNumber, locality, neighborhood
    const { ...inputs } = req.body;

    // Definición de las variables que esperamos
    const dataArray = [
        { input: 'name', dataType: 'string', regex: nameRegex },
        { input: 'description', dataType: 'string', regex: descriptionRegex },
        { input: 'category', dataType: 'string', regex: categoryRegex },
        { input: 'contactNumber', dataType: 'string', regex: contactNumberRegex },
        { input: 'inclusiveElements', dataType: 'object', isArray: true },
        { input: 'location', dataType: 'object' },
        { input: 'locality', dataType: 'string', regex: localityRegex },
        { input: 'neighborhood', dataType: 'string', regex: neighborhoodRegex },
        // { input: 'owner', dataType: 'string', regex: ownerRegex },
        // Falta verificar: imgToAdd e imgToDelete
    ]

    /* Sanitización entradas */
    // Validar el tipo de dato y si cumple con los caracteres permitidos
    // for(var i = 0; i < dataArray.length; i++){
    //     if (typeof (inputs[dataArray[i].input]) !== dataArray[i].dataType) return res.status(422).json({ message: `Tipo de dato de ${dataArray[i].input} no es válido` });
    //     if (dataArray[i].regex.test(inputs[dataArray[i].input]) === false) return res.status(422).json({ message: `Formato de ${dataArray[i].input} no es válido` });
    // }
    // /* Fin sanitización entradas */

    // Validar que el _id del dueño de sitio exista
    const userExist = await User.findOne({ '_id': inputs.owner });
    if (!userExist) return res.status(404).json({ message: "No existe un usuario con ese _id" });

    // Guardar sitio de interés
    InclusiveSites.findOne({ 'name': inputs.name }).then((element) => {
        if (element) {
            res.status(409).json({ message: "Ya existe este sitio inclusivo" })
        } else {
            Neighborhoods.findOne({ 'name': inputs.neighborhood, 'associatedLocality': inputs.locality }).then( async (element) => {
                if (element) {

                    // En esta parte vamos a recorrer el arreglo que contiene los base64 de las imágenes a agregar y los va a subir a Cloudinary, uno por uno
                    const uploadRes = [];
                    for (let index = 0; index < inputs.imgToAdd.length; index++){
                        await cloudinary.uploader.upload(inputs.imgToAdd[index], {
                            upload_preset: "sites_pictures"
                        })
                        .then(resAux => {
                            uploadRes.push(resAux);
                        })
                        .catch(error => {
                            console.log("error: ", error);
                        })                   
                    }

                    // Creación del objeto a agregar en mongodb
                    const newInclusiveSites = new InclusiveSites({
                        name: inputs.name,
                        description: inputs.description,
                        category: inputs.category,
                        contactNumber: inputs.contactNumber,
                        inclusiveElements: inputs.inclusiveElements,
                        location: inputs.location,
                        locality: inputs.locality,
                        neighborhood: inputs.neighborhood,
                        gallery: uploadRes,
                        owner: ObjectId(inputs.owner), // Aquí va el _id del dueño del sitio
                    })


                    newInclusiveSites.save().then((element) => { // Si todo sale bien...

                        // Procedemos a guardar también el sitio en el arreglo de sitios del usuario correspondiente
                        const query = { _id: ObjectId(inputs.owner), associatedSites: { $ne: ObjectId(element._id) } }; // Verificar que el sitio no existe ya en el arreglo
                        const update = {
                            $addToSet: { associatedSites: ObjectId(element._id) } // Agregar el sitio al arreglo solo si no existe ya en el mismo
                        }

                        User.findByIdAndUpdate(query, update).then((element2) => {
                            res.status(200).json({ message: "Sitio creado y usuario actualizado correctamente", element })

                        }).catch((error) => {
                            console.error(error)
                            res.status(500).json({ message: "Error al agregar sitio inclusivo a dueño de sitio" })
                        })
                    })
                    .catch((error) => {
                        console.error(error)
                        res.status(500).json({ message: "Error en creación de sitios inclusivo" })
                    })
                } else {
                    res.status(404).json({ message: "No existe el barrio o localidad ingresada" })
                }
            })
        }
    })
}

module.exports = addInclusiveSites