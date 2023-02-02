require('dotenv').config({ path: '.env' })
const cloudinary = require("../../../middlewares/cloudinary");
const Elements = require("../../../model/inclusiveElements.js");
const { _idMongooseRegex, imageUrlRegex, nameInclusiveElementRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas


const editElement = async (req, res) => {
    const { _id, imageUrl, name } = req.body;

    // /* Sanitización entradas */
    // // 1) Validar el tipo de dato
    // if(typeof(_id) !== 'string') return res.status(422).json({ message: "Tipo de dato de _id no es válido" });
    // if(typeof(imageUrl) !== 'string') return res.status(422).json({ message: "Tipo de dato de URL de imagen no es válido" });
    // if(typeof(name) !== 'string') return res.status(422).json({ message: "Tipo de dato de nombre no es válido" });
    
    // // 2) Validar si cumple con los caracteres permitidos
    // const isValid_id = _idMongooseRegex.test(_id);
    // const isValidImageURL = imageUrlRegex.test(imageUrlRegex);
    // const isValidName = nameInclusiveElementRegex.test(name);

    // if(isValid_id == false) return res.json({ message: "Formato de _id no es válido" });
    // if(isValidImageURL == false) return res.json({ message: "Formato de URL de imagen no es válido" });
    // if(isValidName === false) return res.json({ message: "Formato de nombre no es válido" }); 
    // /* Fin sanitización entradas */

    Elements.findOne({'name': name}).then( async (element)=>{
        if(!element){
            const query = { _id: _id };
            let doc = await Elements.findOne(query);
            if (doc.name !== name && doc.image.secure_url === imageUrl) {
                try {
                    const renameRes = await cloudinary.uploader.rename(`inclusiveElements/${doc.name}`, `inclusiveElements/${name}`);
                    doc.name = name;
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
                        public_id: name,
                        invalidate: true
                    })
        
                    doc.name = name;
                    doc.image = uploadRes;
                    await doc.save();
                    res.json(doc);
        
                } catch (error) {
                    res.status(500).send(error);
                }
            }
        
        }else{
            res.status(409).json({ message: "Ya existe un elemento inclusivo con este nombre"})
        }
    })
    
}

module.exports = editElement