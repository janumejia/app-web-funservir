const cloudinary = require("../../../middlewares/cloudinary");
const InclusiveElement = require("../../../model/inclusiveElements");
const { nameInclusiveElementRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const addInclusiveElement = async (req, res) => {
    const { name, image } = req.body;
    
    /* Sanitización entradas */
    const isValidName = nameInclusiveElementRegex.test(name);

    // falta validar la imagen
    if(isValidName === false) return res.json({ message: "Formato de nombre no es válido" }); // Caso malo
    /* Fin sanitización entradas */
    
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
                    { message: "Elemento creado correctamente", element })})
            }else{
                throw new Error();
            }
        }
    } catch (error) { 
        res.status(500).send(error);
    }
}

module.exports = addInclusiveElement