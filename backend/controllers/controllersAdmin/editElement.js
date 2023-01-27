require('dotenv').config({ path: '.env' })
const cloudinary = require("../../middlewares/cloudinary");

const Elements = require("../../model/inclusiveElements.js");

const editElement = async (req, res) => {
    const { _id, imageUrl, ...resto } = req.body;
    const query = { _id: _id };
    let doc = await Elements.findOne(query);
    if (doc.name !== resto.name && doc.image.secure_url === imageUrl) {
        try {
            const renameRes = await cloudinary.uploader.rename(`inclusiveElements/${doc.name}`, `inclusiveElements/${resto.name}`);
            doc.name = resto.name;
            doc.image = renameRes;
            await doc.save();
            res.json(doc);

        } catch (error) {
            res.status(500).send(error);
        }
    } else {
        try {
            const uploadRes = await cloudinary.uploader.upload(imageUrl, {
                upload_preset: "inclusive_elements",
                public_id: resto.name,
                invalidate: true
            })

            doc.name = resto.name;
            doc.image = uploadRes;
            await doc.save();
            res.json(doc);

        } catch (error) {
            res.status(500).send(error);
        }
    }
}

module.exports = editElement