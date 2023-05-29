const User = require("../../../../model/user")
const cloudinary = require("../../../../middlewares/cloudinary");
const bcrypt = require("bcryptjs")
const { randomAvatar } = require("../../../../utils/avatarGenerator/RandomAvatarGenerator")
const moment = require('moment') // Para validar que el campo fecha realmente tenga una fecha válida
const { ...regex } = require("../../../../regex") // Traemos los regex necesarios para validación de entradas
var validator = require('validator');

const changePictures = async (req, res) => {

    try {
        const { ...inputs } = req.body;

        const decodedDataInToken = req.decodedDataInToken;

        // Cuando la entrada excede le limite permitido, el JSON de la petición llega vacío en este punto
        if (Object.keys(inputs).length === 0) return res.status(413).json({ message: `El tamaño de la información enviada excede los límites permitidos.` });

        let dataArray = [
            { input: 'coverPicture', dataType: 'string', regex: regex.changePicturesImagesRegex },
            { input: 'profilePicture', dataType: 'string', regex: regex.changePicturesImagesRegex }
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


        const validateImages = (images) => {
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                if (!regex.imageRegex.test(image)) {
                    return false;
                }
                const base64Image = image.split(",")[1];
                if (!isImageValid(base64Image)) {
                    return false;
                }
            }

            return true;
        };

        // La imagen tiene esta forma: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlApw1AAAAh1BMVEUAAABk2vth2vxh2/xh2vxh2/xh2vth2/xh2vth2vxh2/xh2vxh2vxh2/xh2vxh2vxh2vth2vth2vth2...
        // entonces el base64 está después de la coma, y eso es lo que le pasamos al método de comprobación
        cloudinaryUrlRegex = RegExp(/^https:\/\/res\.cloudinary\.com\/.*$/);

        // if (inputs.profilePicture && base64Regex.test(inputs.profilePicture)  && !validateImages([inputs.profilePicture])) return res.status(422).json({ message: `La imagen de perfil no es válida por su formato o tamaño` });
        // if (inputs.coverPicture && base64Regex.test(inputs.coverPicture) && !validateImages([inputs.coverPicture])) return res.status(422).json({ message: `La imagen de portada no es válida por su formato o tamaño` });

        let user = await User.findOne({ _id: decodedDataInToken._id }, {coverPicture: 1, profilePicture: 1, gender: 1 });
        if (!user) {
            return res.status(404).json({ message: "No se encontró el usuario a actualizar" });
        }

        let uploadedCoverPicture = {}
        if (inputs.coverPicture === "") {
            // Nothing
            const randomNumber = Math.floor(Math.random() * 10); // Genera un numero aleatorio entre el 0 y 9
            const URL = `https://res.cloudinary.com/pasantiafunservir/image/upload/v1685387081/coverPictures/cover-image-${randomNumber}.jpg`;
            user.coverPicture = URL;

        } else if (cloudinaryUrlRegex.test(inputs.coverPicture)) {
            // Hacer nada aquí
        } else { // Si no es ninguna de las anteriores, entonces es de tipo base64
            if (!validateImages([inputs.coverPicture])) return res.status(422).json({ message: `La imagen de portada no es válida por su formato o tamaño` });

            uploadedCoverPicture = await cloudinary.uploader.upload(inputs.coverPicture, {
                upload_preset: "profile_pictures",
                public_id: inputs.email
            });

            user.coverPicture = uploadedCoverPicture.secure_url
        }

        let uploadedProfilePicture = {}
        if (inputs.profilePicture === "") {
            const prflPic = await randomAvatar(user.gender);
            const uploadRes = await cloudinary.uploader.upload(prflPic, {
                upload_preset: "profile_pictures",
                public_id: inputs.email
            })

            user.profilePicture = uploadRes.secure_url

        } else if (cloudinaryUrlRegex.test(inputs.profilePicture)) {
            // Hacer nada aquí
        } else { // Si no es ninguna de las anteriores, entonces es de tipo base64
            if (!validateImages([inputs.profilePicture])) return res.status(422).json({ message: `La imagen de portada no es válida por su formato o tamaño` });

            uploadedProfilePicture = await cloudinary.uploader.upload(inputs.profilePicture, {
                upload_preset: "profile_pictures",
                public_id: inputs.email
            });

            user.profilePicture = uploadedProfilePicture.secure_url
        }

        await user.save();

        return res.status(200).json({ message: "Imágenes actualizadas correctamente", data: user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al actualizar imágenes" });
    }
}

module.exports = changePictures