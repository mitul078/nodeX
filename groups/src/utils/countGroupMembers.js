const Member = require("../models/member.model")

const countGroupMembers = async (req) => {
    return await Member.countDocuments({
        groupId: req.params.groupId,
        isActive: true
    })
}

module.exports = countGroupMembers