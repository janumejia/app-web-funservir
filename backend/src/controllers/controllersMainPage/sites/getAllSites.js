require('dotenv').config({ path: '.env' })  // Para traer las variables de entorno
const Site = require("../../../model/site") // Traemos el esquema del sitio

const getAllSites = async (req, res) => {

    try{
        // El select contiene los atributos a retornar de la consulta para cada documento de la colección
        const dataFound = await Site.find({ status: "Aprobado" }).populate("inclusiveElements").select("_id name category inclusiveElements location locality neighborhood gallery siteAddress status schedule") 
        return res.json( dataFound )

    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Error al cargar sitios"})
    }

}

module.exports = getAllSites