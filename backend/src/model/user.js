const {model, Schema} = require("mongoose") 

const userSchema = new Schema({ // Opciones de mongoose para definir esquema:https://mongoosejs.com/docs/schematypes.html#schematype-options
    name: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    emailConfirmed: {type: Boolean, required: true},
    password: {type: String, required: true},
    dateOfBirth: {type: Date, required: true},
    gender: {type: String, required: true},
    address: {type: String, required: true},
    condition: {type: [String], required: false},
    isCaregiver: {type: String, required:true},
    institution: {type: String, required: false},
    userType: {type: String, required: true},
    associatedSites: [{ type: Schema.Types.ObjectId, ref: 'Site' }],
    profilePicture: {type: String, required: false},
    coverPicture: {type: String, required: false},
    describeYourself: {type: String, required: false},
    socialInstagram: {type: String, required: false},
    socialFacebook: {type: String, required: false},
    socialTwitter: {type: String, required: false},
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Site' }],
})

module.exports = model("User", userSchema) // Después mongo le pone la s (users)