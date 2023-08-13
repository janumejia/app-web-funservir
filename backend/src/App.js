require('dotenv').config()
const express = require("express")
const cors = require("cors")
const db = require("./database/db")
const cookieParser = require("cookie-parser");
// const cookie = require("cookie");
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression') // Para hacer que las peticiones pesen hasta 10 veces menos usando compresión gzip: https://stackabuse.com/6-easy-ways-to-speed-up-express/

const controllers = require("./controllers/controllersMainPage") // No es necesario poner index.js, por defecto lo toma
const controllersAdmin = require("./controllers/controllersAdmin")
const verifyToken = require("./middlewares/verifyToken");
const verifyTokenAdmin = require("./middlewares/verifyTokenAdmin"); // Para el admin. Comprobamos que el token tenga tipo de usuario administrador

const app = express();

app.use(compression())

app.use(
    helmet({
        strictTransportSecurity: process.env.BACKEND_NODE_ENV !== "development",
        xFrameOptions: { action: "deny" },
        contentSecurityPolicy: false,
        crossOriginOpenerPolicy: false,
        crossOriginResourcePolicy: false,
        xPermittedCrossDomainPolicies: false,
        originAgentCluster: false,
    })
); // Importa encabezados de seguridad automáticamente: 

app.disable('x-powered-by'); // Para que no muestre en el encabezado que la APP está desarrollada con Express JS

app.use(cookieParser()); // Para ajustar la cookie de sesión

/* Los cors permiten configurar políticas de seguridad sobre que peticiones responder
en este caso responde las peticiones desde cualquier origen (inseguro) */
const corsOrigins = process.env.BACKEND_ALLOWED_ORIGINS.split(',');

app.use(cors({
    origin: corsOrigins,
    credentials: true, // Para permitir el envÃ­o de cookies
}))

// Para permitir el envió de archivos grandes en el JSON (necesario para las imágenes)
app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

/* Para mostrar un mensaje de error personalizado al usuario cuando envía un JSON malformado, en vez del mensaje de error real (puede generar fuga de información), en caso que suceda un error en el backend */
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        res.status(422).json({ message: 'El JSON enviado no es válido' });
    } else {
        next();
    }
});

/* Rutas de nuestra APP */
app.get('/', (req, res) => { res.json({ message: "¡Backend Funcionando!"}); });
app.post('/', (req, res) => { res.json({ dataHeaders: req.headers, dataBody: req.body }); });
app.post("/registerUser", controllers.registerUser)
app.post("/registerOwner", controllers.registerOwner)
app.post("/loginUser", controllers.login)
app.post("/uniqueEmailValidator", controllers.uniqueEmailValidator)
app.post("/uniqueSiteNameValidator", controllers.uniqueSitenameValidator)
app.get("/logout", controllers.logout)

// Usuario logueado
app.get("/status", verifyToken, controllers.tokenStatus)
app.get("/user", verifyToken, controllers.getUserById) // Sintaxis -> app.get( path, callback )
app.post("/addSite", verifyToken, controllers.addSite)
app.post("/editSite", verifyToken, controllers.editSite)
app.post("/addComment", verifyToken, controllers.addCommment)
app.post("/reportComment", verifyToken, controllers.reportComment)
app.post("/updateUserInfo", verifyToken, controllers.updateUserInfo)
app.post("/changePictures", verifyToken, controllers.changePictures)
app.post("/changePassword", verifyToken, controllers.changePassword)

// Busqueda de sitios
app.get("/sites", controllers.getAllSites)
app.get("/siteNames", controllers.getAllSiteNames)
app.get("/sites/search", controllers.searchSites)
app.get("/sites/:siteName", controllers.getSingleSite)
app.get("/bestRanking", controllers.getBestRankingSites)

// Rutas del portal administrador a partir de este punto:

app.post("/adminLogin", controllersAdmin.adminLogin)
// Autenticación con Google
app.post("/adminLoginWithGoogle", controllersAdmin.adminLoginWithGoogle)

// Parametría elementos inclusivos:
app.get("/elements", controllersAdmin.getInclusiveElements) // No necesita token porque lo necesitamos para el registro de dueño de sitio
app.post("/addElement", verifyTokenAdmin, controllersAdmin.addInclusiveElement)
app.post("/deleteElement", verifyTokenAdmin, controllersAdmin.deleteElement)
app.post("/editElement", verifyTokenAdmin, controllersAdmin.editElement)

// Parametría usuarios:
app.get("/all_users", verifyTokenAdmin, controllersAdmin.allUsers)
app.post("/addUser", verifyTokenAdmin, controllersAdmin.addUsers)
app.post("/editUser", verifyTokenAdmin, controllersAdmin.editUser)
app.post("/deleteUser", verifyTokenAdmin, controllersAdmin.deleteUser)

// Parametría categorías:
app.get("/getCategories", controllersAdmin.getCategories) // No necesita token porque lo necesitamos para el registro de dueño de sitio
app.post("/addCategory", verifyTokenAdmin, controllersAdmin.addCategory)
app.post("/editCategory", verifyTokenAdmin, controllersAdmin.editCategory)
app.post("/deleteCategory", verifyTokenAdmin, controllersAdmin.deleteCategory)

// Parametría sitios inclusivos
app.get("/getInclusiveSites", verifyTokenAdmin, controllersAdmin.getInclusiveSites)
app.post("/addInclusiveSites", verifyTokenAdmin, controllersAdmin.addInclusiveSites)
app.post("/editInclusiveSites", verifyTokenAdmin, controllersAdmin.editInclusiveSites)
app.post("/deleteInclusiveSites", verifyTokenAdmin, controllersAdmin.deleteInclusiveSites)

// Parametría Localidades:
app.get("/getLocations", controllersAdmin.getLocations)  // No necesita token porque lo necesitamos para el registro de dueño de sitio
app.post("/addLocations", verifyTokenAdmin, controllersAdmin.addLocations)
app.post("/editLocations", verifyTokenAdmin, controllersAdmin.editLocations)
app.post("/deleteLocations", verifyTokenAdmin, controllersAdmin.deleteLocations)

// Parametría barrios:
app.get("/getNeighborhoods", controllersAdmin.getNeighborhoods)  // No necesita token porque lo necesitamos para el registro de dueño de sitio
app.post("/addNeighborhoods", verifyTokenAdmin, controllersAdmin.addNeighborhoods)
app.post("/editNeighborhoods", verifyTokenAdmin, controllersAdmin.editNeighborhoods)
app.post("/deleteNeighborhoods", verifyTokenAdmin, controllersAdmin.deleteNeighborhoods)

// Comentarios reportados
app.get("/getReportedComments", verifyTokenAdmin, controllersAdmin.getReportedComments)
app.post("/deleteReportedComments", verifyTokenAdmin, controllersAdmin.deleteReportedComments)
app.post("/keepReportedComment", verifyTokenAdmin, controllersAdmin.keepReportedComment)

//Notificaciones
app.get("/notification", verifyTokenAdmin, controllersAdmin.siteNotification)

//Obtener el perfil de un usuario
app.get("/profile/:userId", controllers.getUserProfileInfo)

// custom 404
app.use((req, res, next) => {
    res.status(404).json({ message: 'Upss, ruta no encontrada' });
})

/* Fin rutas de nuestra APP */


// Leer puerto por donde funcionará nuestro servidor
const host = process.env.BACKEND_HOST;
const port = process.env.BACKEND_PORT

// Para manejo de errores cuando no es posible conectarse con mongodb
db().then(() => {
    console.log("Ajustando conexión con el servidor...")
    app.listen(port, host, () => {
        console.log(`Servidor funcionando en http://${host}:${port}`);
    });
})
    .catch((error) => {
        console.error('Error al iniciar el servidor');
    });

module.exports = app