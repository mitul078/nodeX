const { error } = require("@nodex/shared");
const Member = require("../models/member.model")

exports.checkMember = async (req, res) => {
    try {

        const { groupId, userId } = req.params

        const member = await Member.findOne({ groupId, userId, isActive: true })

        return res.json({ isMember: !!member })

    } catch (err) {
        return error(res, err.message);
    }
}