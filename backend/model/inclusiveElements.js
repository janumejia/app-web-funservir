const {model, Schema} = require("mongoose") 

const elementSchema = new Schema({
    name: {type: String, required: true, unique: true},
    img:
    {
        data: Buffer,
        contentType: String
    }
})

module.exports = model("InclusiveElements", elementSchema)