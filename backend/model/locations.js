const {model, Schema} = require("mongoose") 

const locationSchema = new Schema({
    name: {type: String, required: true, unique: true, maxLength: 100}
})

module.exports = model("Locations", locationSchema)