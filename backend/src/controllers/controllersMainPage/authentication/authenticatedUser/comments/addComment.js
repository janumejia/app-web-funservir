const Comment = require("../../../../../model/comments");
const InclusiveSite = require("../../../../../model/site");
const User = require("../../../../../model/user");
const { ObjectId } = require('mongodb');

const addComment = async (req, res) => {

    const { ...inputs } = req.body;
    const decodedDataInToken = req.decodedDataInToken;
    try {
        const newComment = new Comment({
            siteId: inputs.siteId,
            userId: ObjectId(decodedDataInToken._id),
            title: inputs.title,
            stars: inputs.stars,
            content: inputs.content
        })
       
        const savedComment = await newComment.save();

        await InclusiveSite.findOne({ _id: inputs.siteId }).then((site) => {
            if (site) {
                site.ratingStars[inputs.stars] = site.ratingStars[inputs.stars] + 1;
                site.ratingTotal = site.ratingTotal + inputs.stars;
                site.ratingCount = site.ratingCount + 1;
                site.rating = (site.ratingTotal / site.ratingCount);
                site.comments.push(savedComment._id);
                
                site.save();
                return res.status(200).json({ message: "Comentario registrado", element: savedComment });
            }else{
                res.status(409).json({ message: "No existe el sitio solicitado" });
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Error en la publicación del comentario" });
    }
}

module.exports = addComment