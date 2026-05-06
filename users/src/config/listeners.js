const { subscribeToQueue } = require("./rabbit")
const User = require("../models/user.model")

module.exports = function () {
    subscribeToQueue("auth.user.created", async (data) => {

        const isExists = await User.findOne({ where: { userId: data.userId } })

        if (isExists) return
        
        await User.create({
            username: data.username,
            email: data.email,
            userId: data.userId
        })
    })
}