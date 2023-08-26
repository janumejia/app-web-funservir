require('dotenv').config({ path: '.env' })  // Para traer las variables de entorno
const KeyPoint = require("../../../model/keyPoint") // Traemos el esquema del sitio
const { ...regex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const getSingleSite = async (req, res) => {
    try {
        const keyPoint = req.params.keyPoint;

        if (regex._idMongooseRegex.test(keyPoint) === false) return res.status(400).json({ message: "_id del lugar tiene un formato incorrecto" })

        let dataSite = await KeyPoint.findById(keyPoint)
            .populate('createdBy', { name: 1, lastName: 1, _id: 1, profilePicture: 1 })
            // .populate('inclusiveElements')
            .populate({
                path: 'comments',
                select: 'siteId userId title content stars reviewFields createdAt updatedAt likes dislikes',
                populate: {
                    path: 'userId',
                    model: 'User',
                    select: 'name lastName email profilePicture',
                },
            }).lean(); // Para que retorne un objeto de javascript (antes daba problemas)

        if(dataSite?.[0]?.comments && dataSite[0].comments.length > 0) {
            dataSite[0].comments.forEach(comment => {
                const likesCount = comment && comment.likes ? comment.likes.length : 0;
                const dislikesCount = comment && comment.dislikes ? comment.dislikes.length : 0;
                comment.likesCount = likesCount;
                comment.dislikesCount = dislikesCount;
            });
        }

        return res.json([dataSite]);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error al cargar sitio" })
    }

}

module.exports = getSingleSite