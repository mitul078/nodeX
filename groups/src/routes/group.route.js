const { validate, limit } = require("@nodex/shared")
const protect = require("../middlewares/protect")
const express = require("express")
const { createGroupValidator } = require("../validators/group.validator")
const { createGroup, getMyGroups, groupDetail, deleteGroup } = require("../controllers/group.controller")
const countMyGroups = require("../utils/countMyGroup")

const router = express.Router()

router.post(
    "/",
    protect,
    createGroupValidator,
    validate,
    limit("maxGroups", countMyGroups),
    createGroup
)

router.get("/my", protect, getMyGroups)
router.get("/:groupId", protect, groupDetail)
router.delete("/:groupId", protect, deleteGroup)

module.exports = router