const { subscribeToQueue } = require("./rabbit");
const Auth = require("../models/auth.model")

module.exports = function () {
    subscribeToQueue("plan.upgrade", async (data) => {
        await Auth.findByIdAndUpdate(data.userId, {
            plan: data.plan
        })
    })
}