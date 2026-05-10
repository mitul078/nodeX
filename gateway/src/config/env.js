require("dotenv").config()

module.exports = {
    port: process.env.PORT,
    auth_service_url: process.env.AUTH_SERVICE_URL,
    users_service_url: process.env.USERS_SERVICE_URL,
    groups_service_url: process.env.GROUPS_SERVICE_URL,
    media_service_url: process.env.MEDIA_SERVICE_URL,
    billing_service_url: process.env.BILLING_SERVICE_URL,
}