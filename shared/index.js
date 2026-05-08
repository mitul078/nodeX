

module.exports = {
    error: require("./utils/error"),
    success: require("./utils/success"),
    validate: require("./middlewares/validate.middleware"),
    protect: require("./middlewares/auth.middleware"),
    internalOnly: require("./middlewares/internal.middleware")
}