const Group = require("../models/group.model")
const Member = require("../models/member.model")
const { error, success } = require("@nodex/shared")


//protected
exports.createGroup = async (req, res) => {
    try {

        const userId = req.user.userId

        const { groupName, description } = req.body

        const group = await Group.create({
            groupName,
            createdBy: userId,
            description
        })

        await Member.create({
            groupId: group._id,
            userId,
            addedBy: userId
        })

        return success(
            res,
            "GROUP IS CREATED",
            {
                groupId: group._id,
                groupName: group.groupName,
                description: group.description,
                createdBy: group.createdBy,
                createdAt: group.createdAt
            },
            201
        )

    } catch (err) {
        return error(res, err.message);
    }
}

//protected
exports.getMyGroups = async (req, res) => {
    try {

        const userId = req.user.userId

        const memberIn = await Member.find({ userId, isActive: true })

        if (memberIn.length === 0) {
            return success(res, "NO GROUPS FOUND", [], 200)
        }

        const groupIds = memberIn.map(m => m.groupId)
        const groups = await Group.find({ _id: { $in: groupIds }, isActive: true })

        return success(res, "GROUPS FETCHED", groups, 200)

    } catch (err) {
        return error(res, err.message);
    }
}

//protected
exports.groupDetail = async (req, res) => {
    try {

        const { groupId } = req.params
        const userId = req.user.userId

        const checkMember = await Member.findOne({ groupId, userId, isActive: true })

        if (!checkMember) return error(res, "USER IS NOT IN GROUP", 403)

        const group = await Group.findOne({ _id: groupId, isActive: true })
        if (!group) return error(res, "GROUP NOT FOUND", 404)

        return success(
            res,
            "GROUP FETCHED",
            {
                groupName: group.groupName,
                description: group.description,
                createdBy: group.createdBy,
                createdAt: group.createdAt,
                coverUrl: group.coverUrl,
            },
            200
        )

    } catch (err) {
        return error(res, err.message);
    }
}

//protected
exports.deleteGroup = async (req, res) => {
    try {

        const userId = req.user.userId
        const { groupId } = req.params

        const group = await Group.findOne({ _id: groupId, createdBy: userId, isActive: true })

        if (!group) return error(res, "GROUP NOT FOUND OR YOU ARE NOT ALLOW TO DELETE IT", 403)

        group.isActive = false
        await group.save()

        await Member.updateMany({ groupId }, { isActive: false })

        return success(res, "GROUP DELETED", {}, 200)

    } catch (err) {
        return error(res, err.message);
    }
}