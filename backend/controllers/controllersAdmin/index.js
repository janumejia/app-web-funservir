const adminLogin = require("./adminLogin")
const editUser = require("./users/editUser")
const addInclusiveElement = require("./inclusiveElements/addInclusiveElement")
const addCategory = require("./categories/addCategory")
const getCategories = require("./categories/getCategories")
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

module.exports = {
    adminLogin,
    editUser,
    addInclusiveElement,
    addCategory,
    getCategories,
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
}