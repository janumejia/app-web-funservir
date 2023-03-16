const register = require("./authentication/register")
const login = require("./authentication/login")
const getUserById = require("./getUserById")
const getAllSites = require("./sites/getAllSites")
const searchSites = require("./sites/searchSites")
const logout = require("./authentication/logout")
const tokenStatus = require("./authentication/tokenStatus")

module.exports = {
    register,
    login,
    getUserById,
    getAllSites,
    searchSites,
    logout,
    tokenStatus,
}