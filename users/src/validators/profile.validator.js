const { body } = require("express-validator")

exports.updateProfileValidator = [
    body("username")
        .optional()
        .trim()
        .notEmpty().withMessage("USERNAME IS REQUIRED")
        .isLength({ min: 6, max: 20 }).withMessage("USERNAME MUST BE 6 TO 20 CHARACTER")
    ,
    body("phone")
        .trim()
        .optional()
        .isMobilePhone()
        .withMessage("INVALID PHONE NUMBER")
    ,
    body("fullName")
        .optional()
        .isLength({ min: 3, max: 20 })
        .withMessage("FULL NAME MUST BE 3-20 CHARACTER")
    ,
    body("bio")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("BIO GOES TILL 200 CHARACTER ONLY")
]