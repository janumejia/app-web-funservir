const {model, Schema} = require("mongoose") 

const userSchema = new Schema({ // Opciones de mongoose para definir esquema:https://mongoosejs.com/docs/schematypes.html#schematype-options
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    edad: {type: String, required: true},
    sexo: {type: String, required: true},
    direccion: {type: String, required: true},
    discapacidad: {type: [String], required:true},
    tutor: {type: Boolean, required:true},
    fundacion: {type: String, required: true},
    userType: {type: String, required: true},
})

module.exports = model("User", userSchema) // Después mongo le pone la s (users)