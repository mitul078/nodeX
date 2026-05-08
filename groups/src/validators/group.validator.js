const { body } = require("express-validator")

exports.createGroupValidator = [
    body("groupName")
        .trim()
        .notEmpty().withMessage("GROUP NAME IS REQUIRED")
        .isLength({ min: 4, max: 20 }).withMessage("GROUP NAME MUST BE 4-20 CHARACTER")
    ,
    body("description")
        .trim()
        .optional()
        .isLength({ max: 300 }).withMessage("DESCRIPTION MAX 300 CHARACTERS")
]

