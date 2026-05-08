const {internalOnly} = require("@nodex/shared")
const env = require("../config/env")

module.exports = internalOnly(env.internal_service_jwt_secret)