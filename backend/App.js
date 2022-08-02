require('dotenv').config({ path: '.env' })
const express = require("express")
const cors = require("cors")
const db = require("./database/db")

const controllers = require("./controllers") // No es necesario poner index.js, por defecto lo toma
const controllersAdmin = require("./controllers/controllersAdmin")
const verifyToken = require("./middlewares/verifyToken");

const app = express()
app.disable('x-powered-by');

/* Los cors permiten configurar políticas de seguridad sobre que peticiones responder
 en este caso responde las peticiones desde cualquier origen (inseguro) */
app.use(cors()) 
app.use(express.json()) // Nos permitirá ver el body que contiene las peticiones POST y PUT

/* Rutas de nuestra APP */
app.get("/user", verifyToken, controllers.getUserById) // Sintaxis -> app.get( path, callback )
app.post("/register", controllers.register)
app.post("/loginUser", controllers.login)
app.post("/adminLogin", controllersAdmin.adminLogin)
app.post("/editUser", controllersAdmin.editUser)

// Leer puerto por donde funcionará nuestro servidor
const host = process.env.HOST || '0.0.0.0' // 0.0.0.0 no es valido, pero Heroku lo detectará y le asignará una valida
const port = process.env.PORT

app.listen(port, host, () =>{ // Sintaxis -> app.listen([port[, host[, backlog]]][, callback]) Más info en: https://www.geeksforgeeks.org/express-js-app-listen-function/
    console.log(`Servidor funcionando en el puerto ${port} y host ${host}`)
    db() // Llamamos a la función db
})

module.exports = app