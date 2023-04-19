// require('dotenv').config()
require('dotenv').config({ path: '.env' })  // Para traer las variables de entorno
const mongoose = require("mongoose")

// Como es un objeto podemos traer las variables de entorno
const BACKEND_MONGO_URL = `${process.env.BACKEND_MONGO_URL}`

const db = async () => {
    await mongoose.connect(BACKEND_MONGO_URL) // Al método mongoose le debemos pasar donde se encuentra la BD
    .then(() => console.log("DB Funcionando")) // Si todo OK...
    .catch(error => console.error(error)) // Si hay algún problema...
}

module.exports = db