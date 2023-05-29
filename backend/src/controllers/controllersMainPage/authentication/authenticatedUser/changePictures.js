const User = require("../../../../model/user")
const cloudinary = require("../../../../middlewares/cloudinary");
const bcrypt = require("bcryptjs")
const { randomAvatar } = require("../../../../utils/avatarGenerator/RandomAvatarGenerator")
const moment = require('moment') // Para validar que el campo fecha realmente tenga una fecha válida
const { ...regex } = require("../../../../regex") // Traemos los regex necesarios para validación de entradas
var validator = require('validator');

const changePictures = async (req, res) => {

    const { ...inputs } = req.body;

    const decodedDataInToken = req.decodedDataInToken;

    // Cuando la entrada excede le limite permitido, el JSON de la petición llega vacío en este punto
    if (Object.keys(inputs).length === 0) return res.status(413).json({ message: `El tamaño de la información enviada excede los límites permitidos.` });

    try {
        if (!inputs.coverPicture && !inputs.profilePicture) return res.status(400).json({ message: "Debes modificar alguna de las imágenes primero" });

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
        if (inputs.coverPicture && !validateImages([inputs.coverPicture])) return res.status(422).json({ message: `La imagen de portada no es válida por su formato o tamaño` });
        if (inputs.profilePicture && !validateImages([inputs.profilePicture])) return res.status(422).json({ message: `La imagen de perfil no es válida por su formato o tamaño` });

        let user = await User.findOne({ _id: decodedDataInToken._id });
        if (!user) {
            return res.status(404).json({ message: "No se encontró el usuario a actualizar" });
        }
        console.log("bien user")

        let uploadedCoverPicture = {}
        if (inputs.coverPicture) {
            uploadedCoverPicture = await cloudinary.uploader.upload(inputs.coverPicture, {
                upload_preset: "profile_pictures",
            });

            user.coverPicture = uploadedCoverPicture.secure_url
        }
        console.log("bien cover")

        let uploadedProfilePicture = {}
        if (inputs.profilePicture) {
            uploadedProfilePicture = await cloudinary.uploader.upload(inputs.profilePicture, {
                upload_preset: "profile_pictures",
            });

            user.profilePicture = uploadedProfilePicture.secure_url
        }
        console.log("bien profile")

        await user.save();

        return res.status(200).json({ message: "Imágenes actualizadas correctamente", data: user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al actualizar imágenes" });
    }
}

module.exports = changePictures