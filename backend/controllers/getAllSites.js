require('dotenv').config({ path: '.env' })  // Para traer las variables de entorno
const Site = require("../model/site") // Traemos el esquema del sitio

const getAllSites = async (req, res) => {

    // const { patternToSearch } = req.body

    // const dataFound = await Site.find({ $or:[{'title': patternToSearch}, {'propertyType': patternToSearch}] })
    Site.find({}).then((dataFound) => {
        return res.json( dataFound )
    });

    // const dataFound = await Site.find({})

}

module.exports = getAllSites