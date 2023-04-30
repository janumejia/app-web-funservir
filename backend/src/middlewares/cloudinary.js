require('dotenv').config({ path: '.env' })
const cloudinaryModule = require('cloudinary')

const cloudinary= cloudinaryModule.v2

cloudinary.config({
    cloud_name: process.env.BACKEND_CLOUDINARY_NAME,
    api_key: process.env.BACKEND_CLOUDINARY_API_KEY,
    api_secret: process.env.BACKEND_CLOUDINARY_API_SECRET
});

module.exports = cloudinary;