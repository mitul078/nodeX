const { subscribeToQueue } = require("./rabbit")
const User = require("../models/user.model")
const { createAndUploadAvatar } = require("../services/avatar.service")

module.exports = function () {
    subscribeToQueue("auth.user.created", async (data) => {

        const isExists = await User.findOne({ where: { userId: data.userId } })

        if (isExists) return

        const avatarUrl = await createAndUploadAvatar(data.userId, data.username)

        await User.create({
            username: data.username,
            email: data.email,
            userId: data.userId,
            avatarUrl
        })
    })
}