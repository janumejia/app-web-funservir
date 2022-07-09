const express = require("express")
const cors = require("cors")
const db = require("./database/db")

const controllers = require("./controllers") // No es necesario poner index.js, por defecto lo toma
const verifyToken = require("./middlewares/verifyToken");

const app = express()

/* Los cors permiten configurar políticas de seguridad sobre que peticiones responder
 en este caso responde las peticiones desde cualquier origen (inseguro) */
app.use(cors()) 
app.use(express.json()) // Nos permitirá ver el body que contiene las peticiones POST y PUT

/* Rutas de nuestra APP */
app.get("/user", verifyToken, controllers.getUserById) // Sintaxis -> app.get( path, callback )
app.post("/register", controllers.register)
app.post("/login", controllers.login)

const PORT = 4000 // Puerto por donde funcionará nuestro servidor

app.listen(PORT, () =>{ // Sintaxis -> app.listen([port[, host[, backlog]]][, callback]) Más info en: https://www.geeksforgeeks.org/express-js-app-listen-function/
    console.log(`Servidor funcionando en el puerto ${PORT}`)
    db() // Llamamos a la función db
})

module.exports = app