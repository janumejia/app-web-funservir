require('dotenv').config({ path: '.env' })
const express = require("express")
const cors = require("cors")
const db = require("./database/db")

const controllers = require("./controllers") // No es necesario poner index.js, por defecto lo toma
const controllersAdmin = require("./controllers/controllersAdmin")
const verifyToken = require("./middlewares/verifyToken");

const app = express();
app.disable('x-powered-by'); // Para que no muestre en el encabezado que la APP está desarrollada con Express JS

/* Los cors permiten configurar políticas de seguridad sobre que peticiones responder
en este caso responde las peticiones desde cualquier origen (inseguro) */
// app.use(cors())
/* Agregar encabezados de seguridad en la aplicación */
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.json()) // Nos permitirá ver el body que contiene las peticiones POST y PUT

/* Para mostrar un mensaje de error personalizado al usuario cuando envía un JSON malformado, en vez del mensaje de error real (puede generar fuga de información), en caso que suceda un error en el backend */
app.use(function (err, req, res, next) {
    // console.error(err.stack);
    res.status(500).json({ message: 'Petición no puede ser procesada' });
});

/* Rutas de nuestra APP */
app.get("/user", verifyToken, controllers.getUserById) // Sintaxis -> app.get( path, callback )
app.post("/register", controllers.register)
app.post("/loginUser", controllers.login)
app.post("/adminLogin", controllersAdmin.adminLogin)
app.post("/editUser", controllersAdmin.editUser)
app.post("/addCategory", controllersAdmin.addCategory)
app.get("/getCategories", controllersAdmin.getCategories)
app.get("/all_users", controllersAdmin.allUsers)
app.post("/addUser", controllersAdmin.addUsers)
app.post("/deleteUser", controllersAdmin.deleteUser)
app.get("/sites", controllers.getAllSites)
app.get("/sites/search=:patternToSearch", controllers.searchSites)
app.get("/elements", controllersAdmin.getInclusiveElements)
app.post("/addElement", controllersAdmin.addInclusiveElement)
app.post("/deleteElement", controllersAdmin.deleteElement)
app.post("/editElement", controllersAdmin.editElement)

// Parametría Localidades:
app.get("/getLocations", controllersAdmin.getLocations)
app.post("/addLocations", controllersAdmin.addLocations)
app.post("/editLocations", controllersAdmin.editLocations)
app.post("/deleteLocations", controllersAdmin.deleteLocations)

// Parametría barrios:
app.get("/getNeighborhoods", controllersAdmin.getNeighborhoods)
app.post("/addNeighborhoods", controllersAdmin.addNeighborhoods)
app.post("/editNeighborhoods", controllersAdmin.editNeighborhoods)
app.post("/deleteNeighborhoods", controllersAdmin.deleteNeighborhoods)

// Parametria sitios inclusivos
app.get("/getInclusiveSites", controllersAdmin.getInclusiveSites)
app.post("/addInclusiveSites", controllersAdmin.addInclusiveSites)
app.post("/editInclusiveSites", controllersAdmin.editInclusiveSites)
app.post("/deleteInclusiveSites", controllersAdmin.deleteInclusiveSites)

// custom 404
// app.use((req, res, next) => {
//     res.status(404).json({ message: 'Upss, ruta no encontrada' });
// })

/* Fin rutas de nuestra APP */

// Leer puerto por donde funcionará nuestro servidor
const host = process.env.HOST || '0.0.0.0' // 0.0.0.0 no es valido, pero Heroku lo detectará y le asignará una valida
const port = process.env.PORT

app.listen(port, host, () => { // Sintaxis -> app.listen([port[, host[, backlog]]][, callback]) Más info en: https://www.geeksforgeeks.org/express-js-app-listen-function/
    console.log(`Servidor funcionando en el puerto ${port} y host ${host}`)
    db() // Llamamos a la función db
})

module.exports = app