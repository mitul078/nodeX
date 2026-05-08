const axios = require("axios")
const env = require("../config/env")
exports.fetchUsers = async (userIds) => {
    try {

        const res = await axios.post(`${env.user_service_url}/internal/bulk`,
            { userIds }, {
            headers: {
                "x-internal-secret": env.internal_service_jwt_secret
            }
        })

        return res.data.data

    } catch (error) {
        console.log("GROUP INTERNAL SERVICE ERROR", error)
        return []
    }
}