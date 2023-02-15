const { validationResult } = require('express-validator')

const validateResult = (req, res, next) => {
    try{
        validationResult(req).throw();
        return next();
    } catch (err) {
        res.status(422).send({ message: `Los siguientes campos no son válidos: ${err.array({ onlyFirstError: true }).map(error => error.param).join(', ')}` }); // 
    }
}

module.exports = { validateResult }