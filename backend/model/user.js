const {model, Schema} = require("mongoose") 

const userSchema = new Schema({ // Opciones de mongoose para definir esquema:https://mongoosejs.com/docs/schematypes.html#schematype-options
    name: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    dateOfBirth: {type: Date, required: true},
    gender: {type: String, required: true},
    address: {type: String, required: true},
    condition: {type: [String], required: false},
    isCaregiver: {type: String, required:true},
    institution: {type: String, required: false},
    userType: {type: String, required: true},
    associatedSites: [{ type: Schema.Types.ObjectId, ref: 'Site' }],
})

module.exports = model("User", userSchema) // Después mongo le pone la s (users)