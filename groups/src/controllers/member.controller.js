const Member = require("../models/member.model")
const Group = require("../models/group.model")
const { error } = require("@nodex/shared")


//protected POST /:groupId/member/add
exports.addMember = async (req, res) => {
    try {

        const adminId = req.user.userId

        const { groupId } = req.params
        const { userId } = req.body

        const group = await Group.findOne({ _id: groupId, isActive: true })
        if (!group) return error(res, "GROUP NOT FOUND", 404)

        const [isMember, isExists] = await Promise.all([
            Member.findOne({ groupId, userId: adminId, isActive: true }),
            Member.findOne({ userId, groupId, isActive: true })
        ])

        if (!isMember) return error(res, "YOU ARE NOT IN THIS GROUP", 403)
        if (isExists) return error(res, "USER IS ALREADY IN GROUP", 409)

        const member = await Member.create({
            groupId,
            addedBy: adminId,
            userId
        })

        return success(res, "USER ADDED IN GROUP", { userId, groupId }, 201)

    } catch (err) {
        return error(res, err.message);
    }
}

//protected DELETE /:groupId/member/:userId/remove
exports.removeMember = async (req, res) => {
    try {

        const adminId = req.user.userId
        const { groupId, userId } = req.params


        const group = await Group.findOne({ _id: groupId, isActive: true })
        if (!group) return error(res, "GROUP NOT FOUND", 404)

        const [admin, member] = await Promise.all([
            Member.findOne({ groupId, userId: adminId, isActive: true }),
            Member.findOne({ groupId, userId, isActive: true })
        ])

        if (!admin) return error(res, "YOU ARE NOT IN THE GROUP", 403)
        if (!member) return error(res, "USER NOT FOUND IN GROUP", 404)

        const isAdmin = adminId === group.createdBy
        const isSelf = adminId === userId

        if (!isAdmin && !isSelf) return error(res, "YOU HAVE NO ACCESS TO REMOVE MEMBER", 403)


        member.isActive = false
        await member.save()

        return success(res, "USER IS REMOVED", {}, 200)

    } catch (err) {
        return error(res, err.message);
    }
}

exports.getMembers = async (req, res) => {
    try {

        const { groupId } = req.params
        const userId = req.user.userId

        const members = await Member.find({ groupId })
        const isAdmin = members[0].userId === userId

        if (isAdmin && members.length === 1) return success(res, "NO MEMBER IN THE GROUP", {}, 200)

        //FOR USER DATA WHAT WE MAKE HTTP REQ OR CREATE QUEUE TO SEND DATA FROM USER SERVICE ?
        return success(res, "MEMBER FETCHED", {}, 200)

    } catch (err) {
        return error(res, err.message);
    }
}



