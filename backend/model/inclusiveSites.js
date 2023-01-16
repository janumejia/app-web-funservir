const {model, Schema} = require("mongoose") 

const neighborhoodSchema = new Schema({
    title: {type: String, required: true, unique: true, validate: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,255}$/},
    description: {type: String, required: true, validate: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,2000}$/},
    category: {type: String, required: true, validate: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,100}$/},
    rating: {type: String, required: true, validate: /^([1-5].[0-9])$/},
    inclusiveElements: {type: String, required: true, validate: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,100}$/},
    // images
    coordinates: {
        latitude: {type: String, required: true, validate: /^[-]{0,1}\d{1,2}\.\d{0,6}$/},
        longitude: {type: String, required: true, validate: /^[-]{0,1}\d{1,3}\.\d{0,6}$/} // Ojo, este regex es diferente al anterior
    },
    location: {type: String, required: true, validate: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,100}$/},
    neighborhoods: {type: String, required: true, validate: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,100}$/}
})

module.exports = model("Neighborhoods", neighborhoodSchema)