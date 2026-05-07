const { protect } = require("@nodex/shared")
const env = require("../config/env")

module.exports = protect(env.jwt_secret)