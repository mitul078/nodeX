const axios = require("axios")
const env = require("../config/env")

exports.checkMember = async (userId, groupId) => {
    try {

        const res = await axios.get(`${env.group_service_url}/api/v1/groups/internal/${groupId}/members/${userId}`, {
            headers: {
                "x-internal-secret": env.internal_service_jwt_secret
            }
        })

        return res.data.isMember

    } catch (error) {
        return false

    }
}