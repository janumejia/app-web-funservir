require('dotenv').config({ path: '.env' })  // Para traer las variables de entorno
const Site = require("../../../model/site") // Traemos el esquema del sitio
const { ...regex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const getSingleSite = async (req, res) => {
    try{
        const siteName = req.params.siteName;

        if(regex.siteNameRegex.test(siteName) === false) return res.status(400).json({message: "Nombre de sitio tiene un formato incorrecto"})

        const dataSite = await Site.find({ 'name': siteName }).populate('owner', {name:1, lastName:1, _id:1, profilePicture: 1}).populate('inclusiveElements').populate({ path: 'comments', populate: { path: 'userId', model: 'User' } });
        

        // Para solo permitir sitios en estado aprobado
        if( dataSite[0].status === 'Aprobado') return res.json( dataSite );
        else return res.status(404).json({ message: "No se encontró el sitio" });

    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Error al cargar sitio"})
    }

}

module.exports = getSingleSite