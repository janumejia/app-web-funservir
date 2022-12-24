const cloudinary = require("../../middlewares/cloudinary");
const InclusiveElement = require("../../model/inclusiveElements");

const addInclusiveElement = async (req, res) => {
    const { name, image } = req.body;
    try {
        if (image) {
            const uploadRes = await cloudinary.uploader.upload(image, {
                upload_preset: "inclusive_elements",
                public_id: name
            })
            
            const element = await InclusiveElement.findOne({ name });
            
            if (!element && uploadRes) {
                const inclusiveElement = new InclusiveElement({
                    name,
                    image: uploadRes
                })
                
                await inclusiveElement.save().then(element=>{res.json(
                    { message: "Usuario creado correctamente", element })})
            }else{
                throw new Error();
            }
        }
    } catch (error) { 
        res.status(500).send(error);
    }
}

module.exports = addInclusiveElement