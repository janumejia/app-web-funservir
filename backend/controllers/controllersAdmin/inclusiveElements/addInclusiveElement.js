const cloudinary = require("../../../middlewares/cloudinary");
const InclusiveElement = require("../../../model/inclusiveElements");
const { nameInclusiveElementRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const addInclusiveElement = async (req, res) => {
    const { name, image } = req.body;

    // Definición de las variables que esperamos
    // const dataArray = [
    //     { input: 'name', dataType: 'string', regex: nameInclusiveElementRegex },
    //     // Falta verificar: imgToAdd e imgToDelete
    // ]

    // /* Sanitización entradas */
    // // Validar el tipo de dato y si cumple con los caracteres permitidos
    // for (var i = 0; i < dataArray.length; i++) {
    //     if (typeof (inputs[dataArray[i].input]) !== dataArray[i].dataType) return res.status(422).json({ message: `Tipo de dato de ${dataArray[i].input} no es válido` });
    //     if (dataArray[i].regex.test(inputs[dataArray[i].input]) === false) return res.status(422).json({ message: `Formato de ${dataArray[i].input} no es válido` });
    // }
    // // /* Fin sanitización entradas */

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

                await inclusiveElement.save().then(element => {
                    res.json(
                        { message: "Elemento creado correctamente", element })
                })
            } else {
                throw new Error();
            }
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = addInclusiveElement