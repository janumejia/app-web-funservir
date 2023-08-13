const Comment = require("../../../model/comments.js");
const InclusiveSites = require("../../../model/site")
const { ...regex } = require("../../../regex") // Importación de patrones de Regex

const keepReportedComment = async (req, res) => {
  // Entradas: name, description, category, contactNumber, locality, neighborhood
  const { ...inputs } = req.body;

  // Declaración de matriz de objetos, donde cada objeto representa un campo que se espera en el JSON de entrada
  const dataArray = [
    // Datos del dueño de sitio:
    { input: '_id', dataType: 'string', regex: regex._idMongooseRegex },
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

  try {
    const theComment = await Comment.findById(inputs._id);

    if (!theComment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    const theSite = await InclusiveSites.findById(theComment.siteId);

    const updateRatingStars = (stars, increment) => {
      if (typeof theSite.ratingStars[stars] === "number" && theSite.ratingStars[stars] > 0) {
        theSite.ratingStars[stars] -= increment;
      }
    };

    updateRatingStars(theComment.stars, 1);

    const newRatingCount = theSite.comments.length === 0 ? 0 : theSite.ratingCount - 1;
    const newRatingTotal = theSite.comments.length === 0 ? 0 : theSite.ratingTotal - theComment.stars;
    const newRating = theSite.comments.length === 0 ? 0 : (theSite.ratingTotal - theComment.stars) / (theSite.ratingCount - 1);
    const newRatingStars = theSite.comments.length === 0 ? { 1: "0", 2: "0", 3: "0", 4: "0", 5: "0" } : theSite.ratingStars;

    const updatedSite = await InclusiveSites.findByIdAndUpdate(
      theComment.siteId,
      {
        $pull: { comments: theComment._id },
        $set: {
          ratingCount: newRatingCount,
          ratingTotal: newRatingTotal,
          rating: newRating,
          ratingStars: newRatingStars,
        },

      },
      { new: true } // Retorna la ultima versión
    );

    await Comment.findByIdAndDelete(inputs._id);

    res.json({ message: "Comentario eliminado correctamente" });

  } catch (error) {
    res.status(500).json({ message: "Error al eliminar comentario" });
  }
};

module.exports = keepReportedComment;