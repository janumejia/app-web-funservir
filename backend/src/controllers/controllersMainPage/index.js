const registerUser = require("./authentication/registerUser")
const registerOwner = require("./authentication/registerOwner")
const login = require("./authentication/login")
const getUserById = require("./getUserById")
const getAllSites = require("./sites/getAllSites")
const searchSites = require("./sites/searchSites")
const logout = require("./authentication/logout")
const tokenStatus = require("./authentication/tokenStatus")
const uniqueEmailValidator = require("./authentication/uniqueEmailValidator")
const uniqueSitenameValidator = require("./authentication/uniqueSitenameValidator")
const addSite = require("./authentication/authenticatedUser/addSite")
const updateUserInfo = require("./authentication/authenticatedUser/updateUserInfo")
const changePassword = require("./authentication/authenticatedUser/changePassword")
const changePictures = require("./authentication/authenticatedUser/changePictures")
const getUserProfileInfo = require("./authentication/getUserProfile")
const getSingleSite = require("./sites/getSingleSite")
const editSite = require("./authentication/authenticatedUser/editSite")
const addCommment = require("./authentication/authenticatedUser/comments/addComment")
const getAllSiteNames = require("./sites/getAllSiteNames")
const getBestRankingSites = require("./sites/getBestRankingSites")
const reportComment = require("./authentication/authenticatedUser/comments/reportComment")
const addLikeDislikeComment = require("./authentication/authenticatedUser/comments/addLikeDislikeComment")
const handleFavorite = require("./authentication/authenticatedUser/handleFavorite")
const addKeyPoint = require("./authentication/authenticatedUser/keyPoints/addKeyPoint")
const getKeyPoints = require("./keyPoints/getKeyPoints")
const getSingleKeyPoint = require("./keyPoints/getSingleKeyPoint")
const editKeyPoint = require("./authentication/authenticatedUser/keyPoints/editKeyPoint")

module.exports = {
    registerUser,
    registerOwner,
    login,
    getUserById,
    getAllSites,
    searchSites,
    logout,
    tokenStatus,
    uniqueEmailValidator,
    uniqueSitenameValidator,
    addSite,
    updateUserInfo,
    changePassword,
    changePictures,
    getUserProfileInfo,
    getSingleSite,
    editSite,
    addCommment,
    getAllSiteNames,
    getBestRankingSites,
    reportComment,
    addLikeDislikeComment,
    handleFavorite,
    addKeyPoint,
    getKeyPoints,
    getSingleKeyPoint,
    editKeyPoint,
}