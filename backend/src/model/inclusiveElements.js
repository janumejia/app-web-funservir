const {model, Schema} = require("mongoose") 

const elementSchema = new Schema({
    name: {type: String, required: true, unique: true},
    image: {type: Object, required: true},
})

module.exports = model("InclusiveElements", elementSchema)