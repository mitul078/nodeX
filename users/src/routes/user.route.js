const express = require("express")
const { me, updateProfile, seeProfile } = require("../controllers/user.controller")
const { updateProfileValidator } = require("../validators/profile.validator")
const router = express.Router()

const { protect, validate } = require("@nodex/shared")

router.get("/profile/me", protect, me)
router.patch("/profile/me/update", protect, updateProfileValidator, validate, updateProfile)
router.get("/profile/:username", protect, seeProfile)

module.exports = router