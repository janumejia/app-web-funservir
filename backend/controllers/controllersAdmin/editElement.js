require('dotenv').config({ path: '.env' })
const cloudinary = require("../../middlewares/cloudinary");

const Elements = require("../../model/inclusiveElements.js");

const editElement = async (req, res) => {
    const { _id, imageUrl,...resto } = req.body;
    const query = { _id: _id };
    try {
        if (imageUrl) {
            const uploadRes = await cloudinary.uploader.upload(imageUrl, {
                upload_preset: "inclusive_elements"
            })
            
            if (uploadRes) {
                const update = {
                    name: resto.name,
                    image: uploadRes,
                }
                await Elements.findByIdAndUpdate(query, update);
            }
        }
    } catch (error) {
        res.status(500).send(error);
    }

    let ans = await Elements.findOne(query); //Revisar si se puede borrar
    res.json(ans);
}

module.exports = editElement