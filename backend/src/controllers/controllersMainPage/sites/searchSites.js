require('dotenv').config({ path: '.env' })  // Para traer las variables de entorno
const Site = require("../../../model/site") // Traemos el esquema del sitio
const Elements = require("../../../model/inclusiveElements.js");

const searchSites = async (req, res) => {
    try {

        // Para hacer la búsqueda del patrón introducido usando consultas regex (https://www.mongodb.com/docs/manual/reference/operator/query/regex/). La i de options es para ignorar mayúsculas o minúsculas
        // Con $or hacemos la búsqueda para varios campos de los registros: titulo, tipo de sitio, ubicación, etc.
        // Con $in podemos pasar multiples palabras en un array para buscar coincidencias
        let query = {
            $and: [
                { "status": "Aprobado" }, // This condition ensures that the "status" is "Aprobado"
            ],
        };

        if (req?.query?.buscar && req.query.buscar.length !== 0) {
            let queryBuscar = {
                $or: [
                    // { "name": { $in: regexArrayName } },
                    // { "category": { $in: regexArrayName } },
                    // { "locality": { $in: regexArrayLocalitiesAndNeighborhoods } },
                    // { "neighborhood": { $in: regexArrayLocalitiesAndNeighborhoods } },
                ]
            }

            // console.log("req?.query?.buscar: ", req.query.buscar)
            // Sanitizar las entradas:
            const sanitizedSearchQuery = req.query.buscar
                .replace(/[áàäâ]/g, 'a')
                .replace(/[éëè]/g, 'e')
                .replace(/[íïì]/g, 'i')
                .replace(/[óöò]/g, 'o')
                .replace(/[üúù]/g, 'u')
                .replace(/[+]/g, ' ')
                .replace(/\s+/g, ' ') // Remove spaces
                .replace(/[_]/g, '') // Remove underscores
                .replace(/[^\w\sñ]/gi, '') // Remove special characters

            // console.log("sanitizedSearchQuery: ", sanitizedSearchQuery)
            // Transformar lo anterior en un regex
            const regexPattern = sanitizedSearchQuery
                .replace(/a/g, '[aáàäâ]')
                .replace(/e/g, '[eéëè]')
                .replace(/i/g, '[iíïì]')
                .replace(/o/g, '[oóöò]')
                .replace(/u/g, '[uüúù]');

            // console.log("regexPattern: ", regexPattern)
            const regexArrayName = regexPattern.split(/[ ]+/g).map(element => new RegExp(element, "i"));
            const regexArrayLocalitiesAndNeighborhoods = regexPattern.split(/[ ]+/g).map(element => {
                const aux = element.replace(/\[[^\[\]]*\]/g, 'a')
                if (aux.length > 3) return new RegExp(element, "i")
            }).filter(regex => regex !== undefined);


            // Aquí se inserta la búsqueda del nombre en la BD
            // query.$and[0].$or.push({ "name": { $in: regexArrayName } });
            console.log("regexArrayName: ", regexArrayName)
            queryBuscar.$or.push({ "name": { $in: regexArrayName } })
            queryBuscar.$or.push({ "category": { $in: regexArrayName } })


            if (regexArrayLocalitiesAndNeighborhoods.length > 0) {
                queryBuscar.$or.push({ "locality": { $in: regexArrayLocalitiesAndNeighborhoods } })
                queryBuscar.$or.push({ "neighborhood": { $in: regexArrayLocalitiesAndNeighborhoods } })
            }
            query.$and.push(queryBuscar)
        }

        if (req?.query?.elementos && req.query.elementos.length !== 0) {

            // console.log("req.query.elementos: ", req.query.elementos)
            // Sanitizar las entradas:
            const patternToSearchV1 = req.query.elementos.replace(/[áàäâ]/g, 'a') // Para reemplazar las vocales con acentos por simplemente la vocal
                .replace(/[éëè]/g, 'e')
                .replace(/[íïì]/g, 'i')
                .replace(/[óöò]/g, 'o')
                .replace(/[üúù]/g, 'u')
                .replace(/[-]/g, ' ')
                .replace(/\s+/g, ' ') // Remover espacios
                .replace(/[_]/g, '') // Remover guion bajo
                .replace(/[^\w\s,ñ]/gi, ''); // Remover caracteres especiales con RegExp. Solo se permiten dígitos, caracteres y espacios en blanco. Sacado de https://stackoverflow.com/questions/4374822/remove-all-special-characters-with-regexp

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

            const inclusiveElements = await Elements.find({}).select("_id name");

            const matchedElementsId = [];

            // console.log("inclusiveElements: ", inclusiveElements)
            // console.log("regexArray: ", regexArray)

            for (const element of regexArray) {
                for (const iElement of inclusiveElements) {
                    if (element.test(iElement.name)) {
                        // console.log("MATCH:", element, " = ", iElement.name);
                        matchedElementsId.push(iElement._id);
                    }
                }
            }

            // console.log("matchedElementsId: ", matchedElementsId);

            // const exactMatch = `^${patternToSearchV2}$`;


            // Aquí se insertan los elementos en la BD
            for (const requiredElement of matchedElementsId) {
                query.$and.push({ "inclusiveElements": { $elemMatch: { $in: requiredElement } } })
            }
        }

        if (req?.query?.categoria && req.query.categoria.length !== 0) {
            // console.log("req?.query?.buscar: ", req.query.buscar)
            // Sanitizar las entradas:
            const patternToSearchV1 = req.query.categoria
                .replace(/[áàäâ]/g, 'a')
                .replace(/[éëè]/g, 'e')
                .replace(/[íïì]/g, 'i')
                .replace(/[óöò]/g, 'o')
                .replace(/[üúù]/g, 'u')
                .replace(/[-]/g, ' ')
                .replace(/\s+/g, ' ') // Remove spaces
                .replace(/[_]/g, '') // Remove underscores
                .replace(/[^\w\s,ñ]/gi, '') // Remove special characters

            // Transformar lo anterior en un regex
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

            // console.log("regexArray: ", regexArray)

            // Aquí se inserta la búsqueda del nombre en la BD
            // query.$and[0].$or.push({ "name": { $in: regexArrayName } });
            query.$and.push({ "category": { $in: regexArray } })
        }

        if (req?.query?.ubicacion && req.query.ubicacion.length !== 0) {
            // console.log("req?.query?.buscar: ", req.query.buscar)
            // Sanitizar las entradas:
            const patternToSearchV1 = req.query.ubicacion
                .replace(/[áàäâ]/g, 'a')
                .replace(/[éëè]/g, 'e')
                .replace(/[íïì]/g, 'i')
                .replace(/[óöò]/g, 'o')
                .replace(/[üúù]/g, 'u')
                .replace(/[-]/g, ' ')
                .replace(/\s+/g, ' ') // Remove spaces
                .replace(/[_]/g, '') // Remove underscores
                .replace(/[^\w\s,ñ]/gi, '') // Remove special characters

            // Transformar lo anterior en un regex
            const patternToSearchV2 = patternToSearchV1.replace(/a/g, '[aáàäâ]') // Considero necesario poner esto, porque en el caso que busquemos "cafeteria" y en la bd está "cafetería" (con tilde) no nos arrojara resultados, entonces esta parte resuelve eso
                .replace(/e/g, '[eéëè]')
                .replace(/i/g, '[iíïì]')
                .replace(/o/g, '[oóöò]')
                .replace(/u/g, '[uüúù]');

            if (/^[^,]*,[^,]*$/.test(req.query.ubicacion)) {
                const patternToSearchV3 = patternToSearchV2.split(/[,]+/g);

                const regexArray = patternToSearchV3.map(function (element) { // Este busca exactamente la cadena, mientas que regexArrayName busca subcadenas
                    const exactMatchPattern = `^${element}$`;
                    return new RegExp(exactMatchPattern, "i");
                });

                // console.log("regexArray: ", regexArray)

                if (patternToSearchV3[1].length > 0) {
                    query.$and.push({ "neighborhood": { $in: regexArray[1] } })
                }

                if (patternToSearchV3[0].length > 0) {
                    query.$and.push({ "locality": { $in: regexArray[0] } })
                }

                // Aquí se inserta la búsqueda del nombre en la BD
                // query.$and[0].$or.push({ "name": { $in: regexArrayName } });
            }
        }

        
        // let dataFound;
        
        // if(query.$and[0].$or.length === 0) { // Para resolver un bug
        //     query.$and.shift(); // Remover el elemento en posición 0 de $and
        // }
        
        let dataFound;
        
        if (req?.query?.mejorPuntuacion && req.query.mejorPuntuacion.length !== 0 && req.query.mejorPuntuacion === "si") {
            dataFound = await Site.find(query).populate("inclusiveElements").select("_id name category inclusiveElements location locality neighborhood gallery siteAddress status schedule rating ratingCount").sort({ rating: -1, ratingCount: -1 });
        } else {
            dataFound = await Site.find(query).populate("inclusiveElements").select("_id name category inclusiveElements location locality neighborhood gallery siteAddress status schedule rating ratingCount")
        }


        // console.log(dataFound);

        if (dataFound) {
            return res.json(dataFound)
        } else {
            throw error;
        }

    } catch (error) {
        console.log("Error:", error)
        return res.json([])
    }
}

module.exports = searchSites;