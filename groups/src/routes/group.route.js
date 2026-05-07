const { validate } = require("@nodex/shared")
const  protect  = require("../middlewares/protect")
const express = require("express")
const { createGroupValidator } = require("../validators/group.validotor")
const { createGroup } = require("../controllers/group.controller")
const router = express.Router()

router.post("/group/create", protect, createGroupValidator, validate, createGroup)

module.exports = router