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
        const element = await InclusiveElement.findOne({ 'name': name });
      
        if (!element) {
          if (image) {
            const uploadRes = await cloudinary.uploader.upload(image, {
              upload_preset: "inclusive_elements",
              public_id: name
            });
      
            const existingElement = await InclusiveElement.findOne({ name });
      
            if (!existingElement && uploadRes) {
              const inclusiveElement = new InclusiveElement({
                name,
                image: uploadRes
              });
      
              await inclusiveElement.save();
              res.json({ message: "Elemento creado correctamente", element: inclusiveElement });
            } else {
              throw new Error();
            }
          }
        } else {
          res.status(409).json({ message: "Ya existe un elemento inclusivo con este nombre" });
        }
      } catch (error) {
        res.status(500).json({ message: "Hubo un error al cargar el elemento inclusivo" });
      }      
}

module.exports = addInclusiveElement