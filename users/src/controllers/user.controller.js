const User = require("../models/user.model");
const error = require("../utils/error");
const success = require("../utils/success");


//protected
exports.me = async (req, res) => {
    try {

        const user = await User.findOne({ userId: req.user.userId })

        return success(res, "USER FETCHED", { user }, 200)

    } catch (err) {
        return error(res, err.message);
    }
}

//protected
exports.seeProfile = async (req, res) => {
    try {

        const { username } = req.params

        const user = await User.findOne({ username })

        if (!user) return error(res, "User not found", 404)

        return success(
            res,
            "PROFILE FETCHED",
            {
                userId: user.userId,
                username: user.username,
                full_name: user.full_name,
                bio: user.bio,
                avatar_url: user.avatar_url,
                is_contact: isContact,
                created_at: user.created_at
            }
        )

    } catch (err) {
        return error(res, err.message);
    }
}

//protected
exports.updateProfile = async (req, res) => {
    try {

        const userId = req.user.userId

        const user = await User.findById(userId)

        if (!user) return error(res, "USER NOT FOUND", 404)

        const allowedFields = ["fullName", "bio", "username", "phone"]

        const updates = {}

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field]
            }
        }

        if (Object.keys(updates).length === 0) {
            return error(res, "NO FIELDS ARE UPDATED", 400)
        }

        if (updates.username && updates.username !== user.username) {
            const taken = await User.findOne({ username: updates.username })

            if (taken) return error(res, "USERNAME IS ALREADY TAKEN", 409)
        }

        const updateUser = await User.findByIdAndUpdate(userId, updates, { new: true })

        return success(res, "PROFILE UPDATED", {
            username: updateUser.username,
            fullName: updateUser.fullName,
            bio: updateUser.bio,
            phone: updateUser.phone,
            updatedAt: updateUser.updatedAt
        }, 200)

    } catch (err) {
        return error(res, err.message);
    }
}