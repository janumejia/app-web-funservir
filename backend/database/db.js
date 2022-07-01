const mongoose = require("mongoose")

const MONGO_URL = "mongodb://localhost/localauthentication"

const db = async () => {
    await mongoose.connect(MONGO_URL) // Aquí se conecta a la base de datos
    .then(() => console.log("DB Funcionando")) // Si todo OK...
    .catch(error => console.error(error)) // Si hay algún problema...
}

module.exports = db