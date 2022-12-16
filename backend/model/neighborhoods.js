const {model, Schema} = require("mongoose") 

const neighborhoodSchema = new Schema({
    name: {type: String, required: true, unique: true, validate: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,100}$/},
    associatedLocality: {type: String, required: true, validate: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,100}$/}
})

module.exports = model("Neighborhoods", neighborhoodSchema)