const {model, Schema} = require("mongoose") 

const elementSchema = new Schema({
    name: {type: String, required: true, unique: true},
    desc: {type: String, required: true},
    icono: {type: String, required: true}, // Url del icono
})

module.exports = model("InclusiveElements", elementSchema)