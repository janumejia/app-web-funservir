// Definición de la estructura de las variables usando Regex:
// Esto permitirá sanitizar las variables de las peticiones que se hacen a la API, y disminuir la presencia de errores o ataques efectivos en el backend

/* Generales */
const generalAlphanumeric = (min, max) => { return new RegExp('^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){' + min + ',' + max + '}$'); } // Letras y números
const generalAlphabetic = (min, max) => { return new RegExp("^([A-Za-zñÑáéíóúÁÉÍÓÚü ]){" + min + "," + max + "}$"); } // Solo letras
/* Fin generales */

module.exports = {

    /* _idMongoose */
    _idMongooseRegex: new RegExp("^[0-9a-fA-F]{24}$"),

    /* Sitios inclusivos */
    titleRegex: new RegExp(/^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,255}$/),
    descriptionRegex: new RegExp(/^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,2000}$/),
    categoryRegex: generalAlphanumeric(1,100),
    ratingRegex: new RegExp(/^([1-5].[0-9])$/),
    inclusiveElementsRegex: generalAlphanumeric(1,100),
    coordinates: {
        latitudeRegex: new RegExp(/^[-]{0,1}\d{1,2}\.\d{0,6}$/),
        longitudeRegex: new RegExp(/^[-]{0,1}\d{1,3}\.\d{0,6}$/), // Ojo, este regex es diferente al anterior
    },
    locationRegex: generalAlphanumeric(1,100),
    neighborhoodsRegex: generalAlphanumeric(1,100),

    /* Localidades */
    nameLocationRegex: generalAlphanumeric(1,100),

    /* Barrios */
    nameNeighborhoodRegex: generalAlphanumeric(1,100),
    nameAssociatedLocalityRegex: generalAlphanumeric(1,100),

    /* Usuarios */
    nameUserRegex: generalAlphabetic(1,100),
    lastNameUserRegex: generalAlphabetic(1,100),
    // dateOfBirth: se valida en el backend de otra forma
    emailRegex: new RegExp(/^\w+([.-]?\w+){1,150}@\w+([.-]?\w+){1,147}(\.\w{2,3})+$/),
    passwordRegex: new RegExp(/^(((?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)_\-\.\?\[\]`~;:\+={}])[a-zA-Z\d!@#\$%\^&\*\(\)_\-\.\?\[\]`~;:\+={}]{8,70})|([$]2[abxy]?[$](?:0[4-9]|[12][0-9]|3[01])[$][.\/0-9a-zA-Z]{53}))$/), // Cumple con los requerimientos de la definición de los datos: https://docs.google.com/spreadsheets/d/1E6UXjeC4WlpGbUcGGMZ0wc7HciOc8zu6Cn9i9dA6MJo/edit#gid=0 al igual que los requisitos de IBM:https://www.ibm.com/docs/en/baw/19.x?topic=security-characters-that-are-valid-user-ids-passwords
    genderRegex: new RegExp(/^(Masculino|Femenino|Otro)$/),
    addressRegex: new RegExp(/^[a-zA-Z0-9 #,.-]{5,255}$/),
    // conditionRegex:
    isCaregiverRegex: new RegExp(/^(Si|No)$/),
    institutionRegex: generalAlphabetic(0,100),
    userTypeRegex: new RegExp(/^(Regular|Propietario|Administrador)$/),

    /* Categorías */
    nameCategoryRegex: generalAlphabetic(1,100),

    /* Elementos inclusivos */
    nameInclusiveElementRegex: generalAlphabetic(1,100),
    // Falta regex para la imagen en base64
    imageUrlRegex: new RegExp(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/),

};