require("dotenv").config()

module.exports = {
    port:                process.env.PORT,
    auth_service_url:    process.env.AUTH_SERVICE_URL,
    user_service_url:    process.env.USER_SERVICE_URL,     // ✅ USER
    group_service_url:   process.env.GROUP_SERVICE_URL,    // ✅ GROUP
    media_service_url:   process.env.MEDIA_SERVICE_URL,
    billing_service_url: process.env.BILLING_SERVICE_URL,
}