require('dotenv').config() // Para traer las variables de entorno
const mongoose = require("mongoose")

const { MONGO_HOST, MONGO_DATABASE } = process.env // Como es un objeto podemos traer las variables de entorno
const MONGO_URL = `mongodb://${MONGO_HOST}/${MONGO_DATABASE}`

const db = async () => {
    await mongoose.connect(MONGO_URL) // Al método mongoose le debemos pasar donde se encuentra la BD
    .then(() => console.log("DB Funcionando")) // Si todo OK...
    .catch(error => console.error(error)) // Si hay algún problema...
}

module.exports = db