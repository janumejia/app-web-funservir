const adminLogin = require("./adminLogin")
const adminLoginWithGoogle = require("./adminLoginWithGoogle") // Autenticación con Google
const editUser = require("./users/editUser")
const addInclusiveElement = require("./inclusiveElements/addInclusiveElement")
const addCategory = require("./categories/addCategory")
const editCategory = require("./categories/editCategory")
const getCategories = require("./categories/getCategories")
const deleteCategory = require("./categories/deleteCategory")
const allUsers = require("./users/allUsers")
const addUsers = require("./users/addUser")
const deleteUser = require("./users/deleteUser")
const getInclusiveElements = require("./inclusiveElements/getInclusiveElements")
const deleteElement = require("./inclusiveElements/deleteElement")
const editElement = require("./inclusiveElements/editElement")
const addLocations = require("./locations/addLocation")
const getLocations = require("./locations/getLocations")
const editLocations = require("./locations/editLocation")
const deleteLocations = require("./locations/deleteLocation")
const addNeighborhoods = require("./neighborhoods/addNeighborhoods")
const getNeighborhoods = require("./neighborhoods/getNeighborhoods")
const editNeighborhoods = require("./neighborhoods/editNeighborhoods")
const deleteNeighborhoods = require("./neighborhoods/deleteNeighborhoods")
const addInclusiveSites = require("./inclusiveSites/addInclusiveSites")
const editInclusiveSites = require("./inclusiveSites/editInclusiveSites")
const getInclusiveSites = require("./inclusiveSites/getInclusiveSites")
const deleteInclusiveSites = require("./inclusiveSites/deleteInclusiveSites")
const siteNotification = require("./notifications/siteNotifications")

module.exports = {
    adminLogin,
    adminLoginWithGoogle,
    editUser,
    addInclusiveElement,
    addCategory,
    editCategory,
    getCategories,
    deleteCategory,
    allUsers,
    addUsers,
    deleteUser,
    getInclusiveElements,
    deleteElement,
    editElement,
    addLocations,
    getLocations,
    editLocations,
    deleteLocations,
    addNeighborhoods,
    getNeighborhoods,
    editNeighborhoods,
    deleteNeighborhoods,
    addInclusiveSites,
    getInclusiveSites,
    editInclusiveSites,
    deleteInclusiveSites,
    siteNotification
}