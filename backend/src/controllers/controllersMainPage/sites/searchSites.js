require('dotenv').config({ path: '.env' })  // Para traer las variables de entorno
const Site = require("../../../model/site") // Traemos el esquema del sitio

const searchSites = async (req, res) => {
    try {

        let query = {
            $and: [
                {
                    $or: [
                        // { "name": { $in: patternToSearchV2 } },
                        // { "name": { $in: regexArrayName } },
                        // { "category": { $in: regexArray } },
                        // { "locality": { $in: regexArray } },
                        // { "neighborhood": { $in: regexArray } },
                    ]
                },
                { "status": "Aprobado" }, // This condition ensures that the "status" is "Aprobado"
            ],
        };

        // if (typeof req.params.patternToSearch !== 'string') return res.status(400).json({ message: "Tipo de dato no válido" })
        if (req?.query?.buscar && req.query.buscar.length !== 0) {
            // Sanitizar las entradas:
            const patternToSearchV1 = req.query.buscar.replace(/[áàäâ]/g, 'a') // Para reemplazar las vocales con acentos por simplemente la vocal
                .replace(/[éëè]/g, 'e')
                .replace(/[íïì]/g, 'i')
                .replace(/[óöò]/g, 'o')
                .replace(/[üúù]/g, 'u')
                .replace(/[+]/g, ' ')
                .replace(/\s+/g, ' ') // Remover espacios
                .replace(/[_]/g, ' ') // Remover guion bajo
                .replace(/[^\w\s]/gi, ''); // Remover caracteres especiales con RegExp. Solo se permiten dígitos, caracteres y espacios en blanco. Sacado de https://stackoverflow.com/questions/4374822/remove-all-special-characters-with-regexp

            const patternToSearchV2 = patternToSearchV1.replace(/a/g, '[aáàäâ]') // Considero necesario poner esto, porque en el caso que busquemos "cafeteria" y en la bd está "cafetería" (con tilde) no nos arrojara resultados, entonces esta parte resuelve eso
                .replace(/e/g, '[eéëè]')
                .replace(/i/g, '[iíïì]')
                .replace(/o/g, '[oóöò]')
                .replace(/u/g, '[uüúù]');

            const patternToSearchV3 = patternToSearchV2.split(/[ ]+/g); // Separa la entrada cada vez que encuentre uno o más espacios (se una Regex). Ej: La cadena "first     middle  last" seria igual a -> ["first","middle","","last"] y no a esto -> ["first","","","","middle","","last"]  https://stackoverflow.com/questions/10079415/splitting-a-string-with-multiple-spaces

            // const regexArray = patternToSearchV3.map(function (element) { // Este busca exactamente la cadena, mientas que regexArrayName busca subcadenas
            //     const exactMatchPattern = `^${element}$`;
            //     return new RegExp(exactMatchPattern, "i");
            // });

            const regexArrayName = patternToSearchV3.map(function (element) { return new RegExp(element, "i") }); // Más info en: https://stackoverflow.com/questions/36932078/unable-to-use-regex-in-in-operator-in-mongodb

            // Hacemos la búsqueda del patrón introducido usando consultas regex (https://www.mongodb.com/docs/manual/reference/operator/query/regex/). La i de options es para ignorar mayúsculas o minúsculas
            // Con $or hacemos la búsqueda para varios campos de los registros: titulo, tipo de sitio, ubicación, etc.
            // Con $in podemos pasar multiples palabras en un array para buscar coincidencias

            // Aquí se inserta la búsqueda del nombre en la BD
            query.$and[0].$or.push({ "name": { $in: regexArrayName } })

        }

        if (req?.query?.elementos && req.query.elementos.length !== 0) {
            // Sanitizar las entradas:
            const patternToSearchV1 = req.query.elementos.replace(/[áàäâ]/g, 'a') // Para reemplazar las vocales con acentos por simplemente la vocal
                .replace(/[éëè]/g, 'e')
                .replace(/[íïì]/g, 'i')
                .replace(/[óöò]/g, 'o')
                .replace(/[üúù]/g, 'u')
                .replace(/[-]/g, ' ')
                .replace(/\s+/g, '') // Remover espacios
                .replace(/[_]/g, '') // Remover guion bajo
                .replace(/[^\w\s,]/gi, ''); // Remover caracteres especiales con RegExp. Solo se permiten dígitos, caracteres y espacios en blanco. Sacado de https://stackoverflow.com/questions/4374822/remove-all-special-characters-with-regexp

            const patternToSearchV2 = patternToSearchV1.replace(/a/g, '[aáàäâ]') // Considero necesario poner esto, porque en el caso que busquemos "cafeteria" y en la bd está "cafetería" (con tilde) no nos arrojara resultados, entonces esta parte resuelve eso
                .replace(/e/g, '[eéëè]')
                .replace(/i/g, '[iíïì]')
                .replace(/o/g, '[oóöò]')
                .replace(/u/g, '[uüúù]');

            const patternToSearchV3 = patternToSearchV2.split(/[,]+/g);

            const regexArray = patternToSearchV3.map(function (element) { // Este busca exactamente la cadena, mientas que regexArrayName busca subcadenas
                const exactMatchPattern = `^${element}$`;
                return new RegExp(exactMatchPattern, "i");
            });

            // const exactMatch = `^${patternToSearchV2}$`;

            console.log("regexArray: ", regexArray)

            // Aquí se insertan los elementos en la BD
            query.$and.push({ "inclusiveElements": { $elemMatch: { $regex: regexArray } } })

        }

        // console.log("query: ", query)

        const dataFound = await Site.find(query).populate("inclusiveElements").select("_id name category inclusiveElements location locality neighborhood gallery siteAddress status schedule")

        if (dataFound) {
            return res.json(dataFound)
        }

    } catch (error) {
        console.log("Error:", error)
        return res.json([])
    }
}

module.exports = searchSites;