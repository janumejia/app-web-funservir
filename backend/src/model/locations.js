const {model, Schema} = require("mongoose") 

const locationSchema = new Schema({
    name: {type: String, required: true, unique: true, validate: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,100}$/} // Validación con regex para mayor seguridad
})

module.exports = model("Locations", locationSchema)