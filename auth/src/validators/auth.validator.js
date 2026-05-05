const { body } = require("express-validator")


exports.signupValidator = [
    body("username")
        .trim()
        .notEmpty().withMessage("USERNAME IS REQUIRED")
        .isLength({ min: 6, max: 20 }).withMessage("USERNAME MUST BE 6 TO 20 CHARACTER")
    ,
    body("email")
        .trim()
        .notEmpty().withMessage("EMAIL IS REQUIRED")
        .isEmail().withMessage("EMAIL MUST BE VALID")
        .normalizeEmail()
    ,
    body("password")
        .notEmpty().withMessage("PASSWORD IS REQUIRED")
        .isLength({ min: 6 }).withMessage("PASSWORD MUST BE AT LEAST 6 CHARACTER")
        .matches(/[A-Z]/).withMessage("PASSWORD MUST CONTAIN AT LEAST ONE UPPERCASE LETTER")
        .matches(/[a-z]/).withMessage("PASSWORD MUST CONTAIN AT LEAST ONE LOWERCASE LETTER")
        .matches(/[0-9]/).withMessage("PASSWORD MUST CONTAIN AT LEAST ONE NUMBER")
        .matches(/[!@#$%^&*]/).withMessage("PASSWORD MUST CONTAIN AT LEAST ONE SPECIAL CHARACTER (!@#$%^&*)")
]

exports.signinValidator = [
    body("username")
        .trim()
        .notEmpty().withMessage("USERNAME IS REQUIRED"),

    body("password")
        .notEmpty().withMessage("PASSWORD IS REQUIRED"),
]
