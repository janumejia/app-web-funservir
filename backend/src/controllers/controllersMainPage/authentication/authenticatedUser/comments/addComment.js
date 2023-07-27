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
        await InclusiveSite.findByIdAndUpdate({ _id: inputs.siteId }, { $addToSet: { comments: savedComment._id } });
        return res.status(200).json({ message: "Comentario registrado", element: savedComment });
    } catch (error) {
        return res.status(500).json({ message: "Error en creación del sitios inclusivo" });
    }
}

module.exports = addComment