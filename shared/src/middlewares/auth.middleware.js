const error = require("../utils/error")
const jwt = require("jsonwebtoken")

const protect = (jwtSecret) => {
    return (req, res, next) => {
        try {

            const authHeader = req.headers.authorization

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return error(res, "ACCESS TOKEN MISSING", 401)
            }

            const accessToken = authHeader.split(" ")[1]
            const decoded = jwt.verify(accessToken, jwtSecret)

            req.user = decoded

            next()

        } catch (err) {
            return error(res, "INVALID OR EXPIRED TOKEN", 401)
        }

    }
}

module.exports = protect