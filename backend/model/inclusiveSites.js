const {model, Schema} = require("mongoose") 
const { titleRegex, descriptionRegex, categoryRegex, ratingRegex, inclusiveElementsRegex, coordinates, locationRegex, neighborhoodsRegex } = require("../../../regex") // Importación de patrones de Regex

const inclusiveSitesSchema = new Schema({
    nameRegex: {type: String, required: true, unique: true, validate: nameRegex},
    description: {type: String, required: true, validate: descriptionRegex},
    category: {type: String, required: true, validate: categoryRegex},
    rating: {type: String, required: true, validate: ratingRegex},
    inclusiveElements: {type: String, required: true, validate: inclusiveElementsRegex},
    // images
    // coordinates: {
    //     latitude: {type: String, required: true, validate: /^[-]{0,1}\d{1,2}\.\d{0,6}$/},
    //     longitude: {type: String, required: true, validate: /^[-]{0,1}\d{1,3}\.\d{0,6}$/} // Ojo, este regex es diferente al anterior
    // },
    location: {type: String, required: true, validate: locationRegex},
    neighborhoods: {type: String, required: true, validate: neighborhoodsRegex}
})

module.exports = model("Neighborhoods", inclusiveSitesSchema)