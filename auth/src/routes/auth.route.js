const express = require("express")
const router = express.Router()
const { signup, signin, refreshToken, signout, getMe } = require("../controllers/auth.controller")

const { signinValidator, signupValidator } = require("../validators/auth.validator")
const { validate , protect } = require("@nodex/shared")

router.post("/signin", signinValidator, validate, signin)
router.post("/signup", signupValidator, validate, signup)
router.post("/refresh-token", refreshToken)
router.get("/me", protect, getMe)
router.post("/signout", signout)

module.exports = router