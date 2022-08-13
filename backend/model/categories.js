const {model, Schema} = require("mongoose") 

const elementSchema = new Schema({
    name: {type: String, required: true, unique: true}
})

module.exports = model("Categories", elementSchema)