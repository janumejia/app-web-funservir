const cloudinary = require("../../../middlewares/cloudinary");
const InclusiveElement = require("../../../model/inclusiveElements");
const { ...regex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const addInclusiveElement = async (req, res) => {
  const { ...inputs } = req.body;

  // Cuando la entrada excede le limite permitido, el JSON de la petición llega vacío en este punto
  if (Object.keys(inputs).length === 0) return res.status(413).json({ message: `El tamaño de la información enviada excede los límites permitidos.` });

  const name = inputs.name;
  const image = inputs.image;

  // Definición de las variables que esperamos
  const dataArray = [
    { input: 'name', dataType: 'string', regex: regex.nameInclusiveElementRegex },
    { input: 'image', dataType: 'string', regex: regex.imageRegex },
  ]
  // Función validateInput que toma tres argumentos: el valor del campo, el tipo de datos que se espera y la expresión regular que se utilizará para validar el valor.
  // La función verifica si el valor del campo es válido según los criterios especificados y devuelve true o false.
  const validateInput = (input, dataName, dataType, regex) => {
    if (dataType === 'string') {
      return typeof input === 'string' && regex.test(input);
    }
    if (dataType === 'array') {
      return Array.isArray(input) && input.every(element => regex.test(element)); // Método every para iterar sobre cada uno de los elementos del arreglo y comprobar si cada elemento cumple con la expresión regular
    }
    if (dataType === 'object') {
      return typeof input === 'object' && input !== null &&
        dataArray.every(({ input: requiredInput, properties, regex: requiredRegex }) => {
          if (requiredInput !== dataName) return true;
          return properties.every(prop => input.hasOwnProperty(prop) && requiredRegex.test(input[prop]));
        });
    }
    return false;
  };

  // El ciclo recorre cada elemento de la matriz dataArray y llama a validateInput con el valor correspondiente del campo del objeto JSON, el tipo de datos y la expresión regular.
  // Si el valor del campo no es válido según los criterios especificados, se devuelve un mensaje de error.
  for (const { input, dataType, regex } of dataArray) {
    const inputValue = inputs[input];
    if (!validateInput(inputValue, input, dataType, regex)) {
      return res.status(422).json({ message: `El valor de ${input} no es válido` });
    }
  }

  // Validación de imagen enviada
  const isBase64 = (str) => {
    try {
      return Buffer.from(str, 'base64').toString('base64') === str;
    } catch (error) {
      return false;
    }
  }

  const isImageValid = (base64Image) => {
    const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
    if (!isBase64(base64Image)) {
      return false;
    }
    const sizeInBytes = Buffer.byteLength(base64Image, 'base64');
    return sizeInBytes <= maxSize;
  }

  // La imagen tiene esta forma: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlApw1AAAAh1BMVEUAAABk2vth2vxh2/xh2vxh2/xh2vth2/xh2vth2vxh2/xh2vxh2vxh2/xh2vxh2vxh2vth2vth2vth2...
  // entonces el base64 está después de la coma, y eso es lo que le pasamos al método de comprobación
  if (!isImageValid(image.split(",")[1])) return res.status(422).json({ message: `La imagen no es válido por su formato o tamaño` });

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