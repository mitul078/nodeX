const cron = require("node-cron")
const Plan = require("../models/plan.model")

function startPlanExpiryJob() {
    cron.schedule("0 0 * * *", async () => {
        try {

            const now = new Date()
            const expiredPlans = await Plan.find({
                plan: { $ne: "free" },
                expiresAt: { $lt: now },
                isActive: true
            })

            if (expiredPlans.length === 0) return

            await Plan.updateMany({
                plan: { $ne: "free" },
                expiresAt: { $lt: now },
                isActive: true
            }, {
                plan: "free",
                expiresAt: null
            })

        } catch (error) {
            console.log("ERROR IN PLAN EXPIRY JOB", error.message)
        }
    })
}

module.exports = startPlanExpiryJob