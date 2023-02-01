require('dotenv').config({ path: '.env' })
const express = require("express")
const cors = require("cors")
const db = require("./database/db")

const controllers = require("./controllers") // No es necesario poner index.js, por defecto lo toma
const controllersAdmin = require("./controllers/controllersAdmin")
const verifyToken = require("./middlewares/verifyToken");
const verifyTokenAdmin = require("./middlewares/verifyTokenAdmin"); // Para el admin. Comprobamos que el token tenga tipo de usuario administrador

const app = express();
app.disable('x-powered-by'); // Para que no muestre en el encabezado que la APP está desarrollada con Express JS

/* Los cors permiten configurar políticas de seguridad sobre que peticiones responder
en este caso responde las peticiones desde cualquier origen (inseguro) */
app.use(cors())
/* Agregar encabezados de seguridad en la aplicación */
// app.use((req, res, next) => {
//     res.append('Access-Control-Allow-Origin', ['*']);
//     res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.append('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });

// app.use(express.json()) // Nos permitirá ver el body que contiene las peticiones POST y PUT

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

/* Para mostrar un mensaje de error personalizado al usuario cuando envía un JSON malformado, en vez del mensaje de error real (puede generar fuga de información), en caso que suceda un error en el backend */
app.use(function (err, req, res, next) {
    // console.error(err.stack);
    res.status(500).json({ message: 'Petición no puede ser procesada' });
    console.log(err);
});

/* Rutas de nuestra APP */
app.get("/user", verifyToken, controllers.getUserById) // Sintaxis -> app.get( path, callback )
app.post("/register", controllers.register)
app.post("/loginUser", controllers.login)

app.get("/sites", controllers.getAllSites)
app.get("/sites/search=:patternToSearch", controllers.searchSites)

// Rutas del portal administrador a partir de este punto:

app.post("/adminLogin", controllersAdmin.adminLogin)
// Autenticación con Google
app.post("/adminLoginWithGoogle", controllersAdmin.adminLoginWithGoogle)

// Parametría elementos inclusivos:
app.get("/elements",  verifyTokenAdmin, controllersAdmin.getInclusiveElements)
app.post("/addElement",  verifyTokenAdmin, controllersAdmin.addInclusiveElement)
app.post("/deleteElement",  verifyTokenAdmin, controllersAdmin.deleteElement)
app.post("/editElement",  verifyTokenAdmin, controllersAdmin.editElement)

// Parametría usuarios:
app.get("/all_users",  verifyTokenAdmin, controllersAdmin.allUsers)
app.post("/addUser",  verifyTokenAdmin, controllersAdmin.addUsers)
app.post("/editUser", verifyTokenAdmin, controllersAdmin.editUser)
app.post("/deleteUser",  verifyTokenAdmin, controllersAdmin.deleteUser)

// Parametría categorías:
app.get("/getCategories", verifyTokenAdmin, controllersAdmin.getCategories)
app.post("/addCategory", verifyTokenAdmin, controllersAdmin.addCategory)
app.post("/editCategory", verifyTokenAdmin, controllersAdmin.editCategory)
app.post("/deleteCategory", verifyTokenAdmin, controllersAdmin.deleteCategory)

// Parametría sitios inclusivos
app.get("/getInclusiveSites", verifyTokenAdmin, controllersAdmin.getInclusiveSites)
app.post("/addInclusiveSites", verifyTokenAdmin, controllersAdmin.addInclusiveSites)
app.post("/editInclusiveSites", verifyTokenAdmin, controllersAdmin.editInclusiveSites)
app.post("/deleteInclusiveSites", verifyTokenAdmin, controllersAdmin.deleteInclusiveSites)

// Parametría Localidades:
app.get("/getLocations", verifyTokenAdmin, controllersAdmin.getLocations)
app.post("/addLocations", verifyTokenAdmin, controllersAdmin.addLocations)
app.post("/editLocations", verifyTokenAdmin, controllersAdmin.editLocations)
app.post("/deleteLocations", verifyTokenAdmin, controllersAdmin.deleteLocations)

// Parametría barrios:
app.get("/getNeighborhoods", verifyTokenAdmin, controllersAdmin.getNeighborhoods)
app.post("/addNeighborhoods", verifyTokenAdmin, controllersAdmin.addNeighborhoods)
app.post("/editNeighborhoods", verifyTokenAdmin, controllersAdmin.editNeighborhoods)
app.post("/deleteNeighborhoods", verifyTokenAdmin, controllersAdmin.deleteNeighborhoods)


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