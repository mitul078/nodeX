const { validationResult } = require("express-validator")
const error = require("../utils/error")

const validate = (req, res, next) => {

    const errors = validationResult(req)
    if (!error.isEmpty()) {
        return error(res, errors.array()[0].msg, 400)
    }

    next()
}

module.exports = validate