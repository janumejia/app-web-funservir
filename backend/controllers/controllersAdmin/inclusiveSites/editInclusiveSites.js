const cloudinary = require("../../../middlewares/cloudinary");
const InclusiveSites = require("../../../model/site")
const Neighborhoods = require("../../../model/neighborhoods")
const User = require("../../../model/user")
const { ObjectId } = require('mongodb');

const { _idMongooseRegex, nameRegex, descriptionRegex, categoryRegex, contactNumberRegex, localityRegex, neighborhoodRegex } = require("../../../regex") // Importación de patrones de Regex

const editInclusiveSites = async (req, res) => {

    // Entradas: _id, name, description, category, contactNumber, locality, neighborhood
    const { ...inputs } = req.body;

    // Definición de las variables que esperamos
    const dataArray = [
        { input: '_id', dataType: 'string', regex: _idMongooseRegex },
        { input: 'name', dataType: 'string', regex: nameRegex },
        { input: 'description', dataType: 'string', regex: descriptionRegex },
        { input: 'category', dataType: 'string', regex: categoryRegex },
        { input: 'contactNumber', dataType: 'string', regex: contactNumberRegex },
        { input: 'locality', dataType: 'string', regex: localityRegex },
        { input: 'neighborhood', dataType: 'string', regex: neighborhoodRegex },
    ]

    /* Sanitización entradas */
    // Validar el tipo de dato y si cumple con los caracteres permitidos
    // for (var i = 0; i < dataArray.length; i++) {
    //     if (typeof (inputs[dataArray[i].input]) !== dataArray[i].dataType) return res.status(422).json({ message: `Tipo de dato de ${dataArray[i].input} no es válido` });
    //     if (dataArray[i].regex.test(inputs[dataArray[i].input]) === false) return res.status(422).json({ message: `Formato de ${dataArray[i].input} no es válido` });
    // }
    // /* Fin sanitización entradas */

    // Validar que el _id del dueño de sitio exista
    const userExist = await User.findOne({ '_id': inputs.owner });
    if (!userExist) return res.status(404).json({ message: "No existe un usuario con ese _id" });

    InclusiveSites.findOne({ '_id': inputs._id }).then((elementIS) => {
        if (!elementIS) {
            res.status(404).json({ message: "No existe un sitio inclusivo con ese _id" })
        } else {

            // Comprobamos que el nombre a modificar no exista
            InclusiveSites.findOne({ 'name': inputs.name }).then((element) => {
                if (element && element._id.toString() !== inputs._id) res.status(409).json({ message: "Ya existe otro sitio inclusivo con ese nombre" })
                else {
                    Neighborhoods.findOne({ 'name': inputs.neighborhood, 'associatedLocality': inputs.locality }).then(async (element) => {
                        if (element) {


                            // En esta parte vamos a recorrer el arreglo que contiene los base64 de las imágenes a agregar y los va a subir a Cloudinary, uno por uno
                            const uploadRes = [];
                            for (let index = 0; index < inputs.imgToAdd.length; index++) {
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

                            //Aquí vamos a eliminar archivos de Cloudinary
                            const deletedImgs = [];
                            for (let index = 0; index < inputs.imgToDelete.length; index++) {
                                await cloudinary.uploader.destroy(inputs.imgToDelete[index]) // Aquí le pasamos el public_id de la imagen a borrar
                                    .then(resAux => {
                                        deletedImgs.push(inputs.imgToDelete[index]);
                                    })
                                    .catch(error => {
                                        console.log("error: ", error);
                                    })
                            }
                            console.log(deletedImgs)


                            const query = { _id: inputs._id };
                            const update = {
                                name: inputs.name,
                                description: inputs.description,
                                category: inputs.category,
                                contactNumber: inputs.contactNumber,
                                inclusiveElements: inputs.inclusiveElements,
                                location: inputs.location,
                                locality: inputs.locality,
                                neighborhood: inputs.neighborhood,
                                $push: { gallery: { $each: uploadRes } },
                                owner: ObjectId(inputs.owner), // Aquí va el _id del dueño del sitio
                            }
                            InclusiveSites.findByIdAndUpdate(query, update).then((element1) => {
                                InclusiveSites.updateMany({ $pull: { gallery: { public_id: { $in: deletedImgs } } } }).then((element) => {

                                    if(elementIS._id === inputs.owner){
                                        res.status(200).json({ message: "Sitio actualizado correctamente", element })
                                    } else if(elementIS._id !== inputs.owner){
                                        
                                        // También procedemos a buscar un usuario que tenga ese sitio asociado y lo borramos
                                        User.updateMany(
                                            // Filtro para seleccionar los documentos que contienen el _id en el arreglo sitios
                                            { "associatedSites": { $elemMatch: { $eq: ObjectId(inputs._id) } } },
                                            // Operador $pull para eliminar el objeto que contiene el _id del arreglo sitios
                                            { $pull: { associatedSites: ObjectId(inputs._id) } }
                                          )
                                            .then((updatedUser) => {

                                                // Procedemos a guardar también el sitio en el arreglo de sitios del usuario correspondiente
                                                const query = { _id: ObjectId(inputs.owner), associatedSites: { $ne: ObjectId(elementIS._id) } }; // Verificar que el sitio no existe ya en el arreglo
                                                const update = {
                                                    $addToSet: { associatedSites: { _id: ObjectId(elementIS._id) } } // Agregar el sitio al arreglo solo si no existe ya en el mismo
                                                }
                                                
                                                User.findByIdAndUpdate(query, update).then((element2) => {
                                                  res.status(200).json({ message: "Sitio y usuarios actualizados correctamente", element1 });
                                                  
          
                                              }).catch((error) => {
                                                  console.error(error)
                                                  res.status(500).json({ message: "Error al agregar sitio inclusivo a dueño de sitio" })
                                              })
                                            })
                                            .catch((error) => {
                                              console.error(error);
                                              res.status(500).json({ message: "Error al eliminar sitio del usuario" });
                                            });
                                            


                                    } else {
                                        res.status(500).json({ message: "Error" })
                                    }
                                }).catch((error) => {
                                    console.log(error);
                                    res.status(500).json({ message: "Error en la eliminación de imágenes" })
                                })

                            }).catch((error) => {
                                console.error(error)
                                res.status(500).json({ message: "Error en actualización de sitios inclusivo" })
                            })
                        } else {
                            res.status(404).json({ message: "No existe el barrio o localidad ingresada" })
                        }
                    })
                }
            })

        }
    })
}

module.exports = editInclusiveSites