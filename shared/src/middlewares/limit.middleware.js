const plans = require("../config/plans");

const limit = (limitKey, getCount) => {
    return async (req, res, next) => {
        try {

            const userPlan = req.user.plan || "free"
            const limit = plans[userPlan][limitKey]
            const current = await getCount(req)

            console.log("USER PLAN:", userPlan)
            console.log("LIMIT KEY:", limitKey)
            console.log("LIMIT:", limit)
            console.log("CURRENT:", current)

            if (current >= limit) {
                return res.status(403).json({
                    success: false,
                    message: "PLAN LIMIT REACHED",
                    current,
                    limit,
                    upgrade: true
                })
            }

            next()

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message

            });
        }
    }
}

module.exports = limit