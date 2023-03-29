const registerUser = require("./authentication/registerUser")
const login = require("./authentication/login")
const getUserById = require("./getUserById")
const getAllSites = require("./sites/getAllSites")
const searchSites = require("./sites/searchSites")
const logout = require("./authentication/logout")
const tokenStatus = require("./authentication/tokenStatus")

module.exports = {
    registerUser,
    login,
    getUserById,
    getAllSites,
    searchSites,
    logout,
    tokenStatus,
}