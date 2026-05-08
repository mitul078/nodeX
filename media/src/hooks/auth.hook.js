const jwt = require("jsonwebtoken")
const env = require("../config/env")

module.exports = async function authHook(request, reply) {
    try {

        const token = request.headers.authorization.split(" ")[1]
        if (!token) {
            return reply.code(401).send({
                success: false,
                message: "ACCESS TOKEN MISSING"
            })
        }

        const decoded = jwt.verify(token, env.jwt_secret)
        
        request.user = decoded

    } catch (err) {
        return reply.code(401).send({
            success: false,
            message: "INVALID OR EXPIRED TOKEN"
        })
    }
}