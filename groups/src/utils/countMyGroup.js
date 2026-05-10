const Group = require("../models/group.model")

const countMyGroups = async (req) => {
    return await Group.countDocuments({
        createdBy: req.user.userId,
        isActive: true
    })
}

module.exports = countMyGroups
