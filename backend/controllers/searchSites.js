require('dotenv').config({ path: '.env' })  // Para traer las variables de entorno
const Site = require("../model/site") // Traemos el esquema del sitio

const searchSites = async (req, res) => {

    // Sanitizar las entradas:
    const patternToSearchV1 = req.params.patternToSearch.replace(/[á,à,ä,â]/g, 'a') // Para reemplazar las vocales con acentos por simplemente la vocal
        .replace(/[é,ë,è]/g, 'e')
        .replace(/[í,ï,ì]/g, 'i')
        .replace(/[ó,ö,ò]/g, 'o')
        .replace(/[ü,ú,ù]/g, 'u')
        .replace(/[+]/g, ' ')
        .replace(/[^\w\s]/gi, ''); // Remover caracteres especiales con RegExp. Solo se permiten dígitos, caracteres y espacios en blanco. Sacado de https://stackoverflow.com/questions/4374822/remove-all-special-characters-with-regexp

    const patternToSearchV2 = patternToSearchV1.replace(/a/g, '[a,á,à,ä,â]') // Considero necesario poner esto, porque en el caso que busquemos "cafeteria" y en la bd está "cafetería" (con tilde) no nos arrojara resultados, entonces esta parte resuelve eso
        .replace(/e/g, '[e,é,ë,è]')
        .replace(/i/g, '[i,í,ï,ì]')
        .replace(/o/g, '[o,ó,ö,ò]')
        .replace(/u/g, '[u,ü,ú,ù]');

    console.log(patternToSearchV2)
    const patternToSearchV3 = patternToSearchV2.split(/[ ]+/g); // Separa la entrada cada vez que encuentre uno o más espacios (se una Regex). Ej: La cadena "first     middle  last" seria igual a -> ["first","middle","","last"] y no a esto -> ["first","","","","middle","","last"]  https://stackoverflow.com/questions/10079415/splitting-a-string-with-multiple-spaces
    const regexArray = patternToSearchV3.map(function (element) { return new RegExp(element, "i") }); // Este es igual al anterior array pero en el formato de expresión regular (Regex) para que lo pueda incluir adentro de $in en la siguiente consulta. Más info en: https://stackoverflow.com/questions/36932078/unable-to-use-regex-in-in-operator-in-mongodb

    // Hacemos la búsqueda del patrón introducido usando consultas regex (https://www.mongodb.com/docs/manual/reference/operator/query/regex/). La i de options es para ignorar mayúsculas o minúsculas
    // Con $or hacemos la búsqueda para varios campos de los registros: titulo, tipo de sitio, ubicación, etc.
    // Con $in podemos pasar multiples palabras en un array para buscar coincidencias
    console.log("Buscando:")
    console.log(regexArray)
    Site.find(
        {
            $or: [
                { "title": { $in: regexArray } },
                // { "content": { $in: regexArray } },
                // { "propertyType": { $in: regexArray } },
                { "location.city": { $in: regexArray } },
                { "location.formattedAddress": { $in: regexArray } }
            ]
        })
        .then((dataFound) => {
            console.log("Encontrado:")
            console.log(dataFound)
            return res.json(dataFound)
        });

}

module.exports = searchSites