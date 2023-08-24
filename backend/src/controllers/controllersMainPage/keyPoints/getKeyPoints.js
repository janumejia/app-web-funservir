require('dotenv').config({ path: '.env' })  // Para traer las variables de entorno
const Site = require("../../../model/site") // Traemos el esquema del sitio
const Elements = require("../../../model/inclusiveElements.js");
const KeyPoint = require('../../../model/keyPoint');

const getKeyPoints = async (req, res) => {
    try {
        let dataFound;
        if (req?.query?.elementos_inclusivos && req.query.elementos_inclusivos === "no") {
            dataFound = await KeyPoint.find({ classification: 'architecturalBarrier' }).select("_id classification title description gallery location formattedAddress updatedAt").sort({ updatedAt: -1 });
        } else if (req?.query?.barreras_arquitectonicas && req.query.barreras_arquitectonicas === "no") {
            dataFound = await KeyPoint.find({ classification: 'inclusiveElement' }).select("_id classification title description gallery location formattedAddress updatedAt").sort({ updatedAt: -1 });
        } else {
            dataFound = await KeyPoint.find().select("_id classification title description gallery location formattedAddress updatedAt").sort({ updatedAt: -1 });
        }
        console.log("entra all key")
        if (dataFound) {
            return res.json(dataFound)
        } else {
            throw error;
        }

    } catch (error) {
        console.log("Error:", error)
        return res.json([])
    }
}

module.exports = getKeyPoints;