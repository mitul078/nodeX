const express = require("express")
const protect = require("../middlewares/auth.middleware")
const { me, updateProfile, seeProfile } = require("../controllers/user.controller")
const { updateProfileValidator } = require("../validators/profile.validator")
const validate = require("../middlewares/validate.middleware")
const router = express.Router()

router.get("/profile/me", protect, me)
router.patch("/profile/me/update", protect, updateProfileValidator, validate, updateProfile)
router.get("/profile/:username", protect, seeProfile)

module.exports = router