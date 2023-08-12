require('dotenv').config({ path: '.env' })  // Para traer las variables de entorno
const Site = require("../../../model/site") // Traemos el esquema del sitio

const getBestRankingSites = async (req, res) => {
    try {
        // El select contiene los atributos a retornar de la consulta para cada documento de la colección
        const dataFound = await Site.find({
            status: "Aprobado",
            rating: { $gte: 4.0 } // Rating greater than or equal to 4.0
        })
            .populate("inclusiveElements")
            .select("_id name category inclusiveElements location locality neighborhood gallery siteAddress status schedule rating ratingCount")
            .sort({ rating: -1, ratingCount: -1 })
            .limit(10); // Limit the results to 10 sites

        return res.json(dataFound)

    } catch (error) {
        console.log(error)
        return res.status(200).json({})
    }

}

module.exports = getBestRankingSites