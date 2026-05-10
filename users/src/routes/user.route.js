const express = require("express")
const { me, updateProfile, seeProfile, bulkUsers, userExists } = require("../controllers/user.controller")
const { updateProfileValidator } = require("../validators/profile.validator")
const router = express.Router()

const { validate } = require("@nodex/shared")
const protect = require("../middlewares/protect")
const internal = require("../middlewares/internal")


router.get("/profile/me", protect, me)
router.patch("/profile/me/update", protect, updateProfileValidator, validate, updateProfile)
router.get("/profile/:username", protect, seeProfile)

//internal routes
router.post("/internal/bulk", internal, bulkUsers)
router.get("/internal/:userId/exists", internal, userExists)

module.exports = router