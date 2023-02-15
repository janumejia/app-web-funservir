const { check } = require('express-validator')
const { validateResult } = require('../helpers/validateHelpers')

const validateNeighborhood = [
    check('name').exists().notEmpty().isString().matches(/^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,100}$/),
    check('associatedLocality').exists().notEmpty().isString().matches(/^([A-Za-z0-9ñÑáéíóúÁÉÍÓÚü ]){1,100}$/),
    
    (req, res, next) => validateResult(req, res, next)
]

module.exports = { validateNeighborhood }