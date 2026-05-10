const express = require("express")
const protect = require("../middlewares/protect")
const { addMember, removeMember, getMembers } = require("../controllers/member.controller")
const { addMemberValidator } = require("../validators/member.validator")
const { validate, limit } = require("@nodex/shared")
const countGroupMembers = require("../utils/countGroupMembers")
const router = express.Router()

router.post(
    "/:groupId/members",
    protect,
    addMemberValidator,
    validate,
    limit("maxMembers", countGroupMembers),
    addMember
)


router.delete("/:groupId/members/:userId", protect, removeMember)
router.get("/:groupId/members", protect, getMembers)

module.exports = router