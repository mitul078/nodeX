const express = require("express")
const internal = require("../middlewares/internal")
const { checkMember } = require("../controllers/internal.controller")
const router = express.Router()


router.get("/internal/:groupId/members/:userId", internal, checkMember)

module.exports = router