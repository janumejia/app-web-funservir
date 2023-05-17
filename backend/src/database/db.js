// require('dotenv').config()
require('dotenv').config({ path: '.env' })  // Para traer las variables de entorno
const mongoose = require("mongoose")

const db = () => {
    return new Promise((resolve, reject) => {
      mongoose.connect(process.env.BACKEND_MONGO_URL)
        .then(() => {
          console.log('Database connected successfully');
          resolve();
        })
        .catch((error) => {
          console.error('Error connecting to the database:', error);
          reject(error);
        });
    });
  };

module.exports = db