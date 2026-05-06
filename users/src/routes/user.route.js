const express = require("express")
const protect = require("../middlewares/auth.middleware")
const { me } = require("../controllers/user.controller")
const router = express.Router()

router.get("/me", protect, me)

module.exports = router