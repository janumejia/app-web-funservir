const express = require("express")
const cors = require("cors")
const db = require("./database/db")

const controllers = require("./controllers") // No es necesario poner index.js, por defecto lo toma

const app = express()

app.use(cors()) // Me permitirá enviar datos entre el frontend y el backend
app.use(express.json()) // Nos permitirá ver el body que contiene las petiones POST y PUT

/* Rutas de nuestra APP */
app.get("/user/:id", controllers.getUserById)
app.post("/register", controllers.register)
app.post("/login", controllers.login)

const PORT = 4000 // Puerto por donde funcionará nuestro servidor

app.listen(PORT, () =>{
    console.log(`Servidor funcionando en el puerto ${PORT}`)
    db() // Llamamos a la función db
})

module.exports = app