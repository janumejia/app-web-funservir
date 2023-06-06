require('dotenv').config({ path: '.env' })  // Para traer las variables de entorno
const Site = require("../../../model/site") // Traemos el esquema del sitio

const getAllSites = async (req, res) => {

    // const { patternToSearch } = req.body

    // const dataFound = await Site.find({ $or:[{'title': patternToSearch}, {'propertyType': patternToSearch}] })
    try{
        const dataFound = await Site.find({}).populate("inclusiveElements")
        return res.json( dataFound )

    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Error al cargar sitio"})
    }


    // const dataFound = await Site.find({})

}

module.exports = getAllSites