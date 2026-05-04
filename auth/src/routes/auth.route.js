const express = require("express")
const router = express.Router()
const { signup } = require("../controllers/auth.controller")

// router.post("/signin")
router.post("/signup", signup)
// router.post("/refresh-token")
// router.get("/getMe")
// router.post("/signout")

module.exports = router