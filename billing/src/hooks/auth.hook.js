const jwt = require("jsonwebtoken")
const env = require("../config/env")

module.exports = async function authHook(request, reply) {
    try {

        const authHeader = request.headers.authorization

        // ✅ check header exists first
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return reply.code(401).send({
                success: false,
                message: "ACCESS TOKEN MISSING"
            })
        }

        const token   = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, env.jwt_secret)

        request.user  = decoded

    } catch (err) {
        return reply.code(401).send({
            success: false,
            message: "INVALID OR EXPIRED TOKEN"
        })
    }
}