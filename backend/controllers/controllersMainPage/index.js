const register = require("./register")
const login = require("./login")
const getUserById = require("./getUserById")
const getAllSites = require("./getAllSites")
const searchSites = require("./searchSites")
const logout = require("./logout")

module.exports = {
    register,
    login,
    getUserById,
    getAllSites,
    searchSites,
    logout,
}