module.exports = {
    error: require("./src/utils/error"),
    success: require("./src/utils/success"),
    validate: require("./src/middlewares/validate.middleware"),
    protect: require("./src/middlewares/auth.middleware"),
    internalOnly: require("./src/middlewares/internal.middleware"),
    limit: require("./src/middlewares/limit.middleware"),
    plans: require("./src/config/plans")
}