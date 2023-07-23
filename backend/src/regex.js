// Definición de la estructura de las variables usando Regex:
// Esto permitirá sanitizar las variables de las peticiones que se hacen a la API, y disminuir la presencia de errores o ataques efectivos en el backend

/* Generales */
const generalAlphanumeric = (min, max) => { return new RegExp("^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){" + min + "," + max + "}$"); } // Letras y números
const generalAlphabetic = (min, max) => { return new RegExp("^([A-Za-zñÑáéíóúÁÉÍÓÚü ]){" + min + "," + max + "}$"); } // Solo letras
/* Fin generales */

module.exports = {
    /* _idMongoose */
    _idMongooseRegex: new RegExp("^[0-9a-fA-F]{24}$"),
    _idMongooseRegexOrEmpty: new RegExp("^[0-9a-fA-F]{24}$|^$"),

    /* Sitios inclusivos */
    siteNameRegex: new RegExp(/^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü\s,.:-]){1,255}$/),
    descriptionRegex: new RegExp(/^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü\s,.:\-;\(\)\[\]¿?¡!$&\/]){1,2000}$/),
    categoryRegex: generalAlphanumeric(1,100),
    ratingRegex: new RegExp(/^([1-5].[0-9])$/),
    ratingCountRegex: new RegExp(/^\d{1,10}$/),
    contactNumberRegex: new RegExp(/^\d{10}$/), // Deben ser +57
    contactNumber2Regex: new RegExp(/^\d{10}$|^$/), // Similar al anterior pero permite vació
    inclusiveElementsRegex: generalAlphanumeric(1,100),
    moreInfoInclusivityRegex: new RegExp(/^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü\s,.:\-;\(\)\[\]¿?¡!$&\/]){0,500}$/),
    locationRegex: new RegExp(/^[-]{0,1}\d{1,4}\.\d{1,20}$/),
    localityRegex: generalAlphanumeric(1,100),
    neighborhoodRegex: generalAlphanumeric(1,100),
    timeRegex: new RegExp(/^([01]\d|2[0-3]):([0-5]\d)$/),
    imgToDeleteRegex: new RegExp(/^[a-zA-Z0-9_.\/-]+$/),
    siteStatusRegex: new RegExp(/^(Pendiente|Aprobado|Rechazado)$/),
    socialWhatsappRegex: new RegExp(/^\d{10}$|^$/), // Igual que el regex de numero telefónico, y se le debe agregar +57
    webpageRegex: new RegExp(/(^(https:\/\/)[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+(\/[a-zA-Z0-9\-\._\?\,\'\/\\\+&amp;%\$#\=~]*)?$)|(^$)/),

    /* Localidades */
    nameLocationRegex: generalAlphanumeric(1,100),

    /* Barrios */
    nameNeighborhoodRegex: generalAlphanumeric(1,100),
    nameAssociatedLocalityRegex: generalAlphanumeric(1,100),

    /* Usuarios */
    nameUserRegex: generalAlphabetic(1,100),
    lastNameUserRegex: generalAlphabetic(1,100),
    emailRegex: new RegExp(/^[^@+]+@/), // Para no permitir el signo de suma antes del @. Documentación: https://www.fastmail.help/hc/en-us/articles/360060591053-Plus-addressing-and-subdomain-addressing#:~:text=Plus%20addressing%20means%20any%20email,%2C%20sites%2C%20or%20mailing%20lists
    // passwordRegex: new RegExp(/^(((?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)_\-\.\?\[\]`~;:\+={}])[a-zA-Z\d!@#\$%\^&\*\(\)_\-\.\?\[\]`~;:\+={}]{8,70})|([$]2[abxy]?[$](?:0[4-9]|[12][0-9]|3[01])[$][.\/0-9a-zA-Z]{53}))$/), // Cumple con los requerimientos de la definición de los datos: https://docs.google.com/spreadsheets/d/1E6UXjeC4WlpGbUcGGMZ0wc7HciOc8zu6Cn9i9dA6MJo/edit#gid=0 al igual que los requisitos de IBM:https://www.ibm.com/docs/en/baw/19.x?topic=security-characters-that-are-valid-user-ids-passwords
    passwordRegex: new RegExp(/^([a-zA-ZñÑáéíóúÁÉÍÓÚü0-9~`¿¡!#$%\^&*€£@+÷=\-\[\]\\';,/{}\(\)|\\":<>\?\.\_]){8,70}$/),
    genderRegex: new RegExp(/^(Masculino|Femenino|Otro)$/),
    addressRegex: new RegExp(/^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚü\s\.,-\/#]{5,255}$/),
    conditionRegex: new RegExp(/^( Motriz | Visual | Auditiva | Sensorial | Comunicación | Mental | Múltiples | Otra )$/),
    isCaregiverRegex: new RegExp(/^(Si|No)$/),
    institutionRegex: generalAlphanumeric(0,255),
    userTypeRegex: new RegExp(/^(Regular|Propietario|Administrador)$/),
    profilePictureRegex: new RegExp(/(^data:image\/(?:jpe?g|png|gif|bmp|webp|svg|ico|tiff?);base64,.*$)|(^$)/), // Vació es válido
    describeYourselfRegex: new RegExp(/^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü\s,.:\-;\(\)\[\]¿?¡!$&\/]){0,2000}$|^$/), // Acepta vacío también
    socialTwitterRegex: new RegExp(/^(?:https:\/\/)(?:www\.)?twitter\.com\/([a-zA-Z0-9_]){1,255}[\/]{0,1}$|^$/), // Acepta vacío también
    socialInstagramRegex: new RegExp(/^(?:https:\/\/)(?:www\.)?instagram\.com\/([a-zA-Z0-9_\.]){1,255}[\/]{0,1}$|^$/), // Acepta vacío también
    socialFacebookRegex: new RegExp(/^(?:https:\/\/)(?:www\.)?facebook\.com\/([a-zA-Z0-9_\.]){1,255}[\/]{0,1}$|^$/), // Acepta vacío también
    // Regex para cambiar fotos de usuario
    changePicturesImagesRegex: new RegExp(/(^data:image\/(?:jpe?g|png|gif|bmp|webp|svg|ico|tiff?);base64,.*$)|(^https:\/\/res\.cloudinary\.com\/.*$)|(^$)/),

    /* Categorías */
    nameCategoryRegex: generalAlphabetic(1,100),

    /* Elementos inclusivos */
    nameInclusiveElementRegex: generalAlphabetic(1,100),
    imageRegex: new RegExp(/(^data:image\/(?:jpe?g|png|svg);base64,.*)/),
    imageUrlRegex: new RegExp(/(^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$)/),

};