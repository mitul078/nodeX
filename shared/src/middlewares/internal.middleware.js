

const internalOnly = (token) => {
    return (req, res, next) => {
        const secret = req.headers["x-internal-secret"]
        if (secret !== token) {
            return error(res, "UNAUTHORIZED", 401)
        }
        next()
    }
}
module.exports = internalOnly