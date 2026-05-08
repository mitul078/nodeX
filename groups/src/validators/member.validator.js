const {body}  = require("express-validator")

exports.addMemberValidator = [
    body("userId")
    .trim()
    .notEmpty().withMessage("USERID IS REQUIRED")
]