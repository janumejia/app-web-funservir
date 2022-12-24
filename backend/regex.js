// Definición de la estructura de las variables usando Regex:
// Esto permitirá sanitizar las variables de las peticiones que se hacen a la API
module.exports = {

    
    /* Sitio de interés */
    titleRegex: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,255}$/,
    descriptionRegex: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,2000}$/,
    categoryRegex: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,100}$/,
    ratingRegex: /^([1-5].[0-9])$/,
    inclusiveElementsRegex: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,100}$/,
    coordinates: {
        latitudeRegex: /^[-]{0,1}\d{1,2}\.\d{0,6}$/,
        longitudeRegex: /^[-]{0,1}\d{1,3}\.\d{0,6}$/ // Ojo, este regex es diferente al anterior
    },
    locationRegex: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,100}$/,
    neighborhoodsRegex: /^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,100}$/
};