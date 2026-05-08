require("dotenv").config()
const requiredVariables = [
    "MONGO_URI",
    "PORT",
    "JWT_SECRET",
    "RABBITMQ_URL",
    "INTERNAL_SERVICE_JWT_SECRET",
    "USER_SERVICE_URL"
]

requiredVariables.forEach((value) => {
    const variable = process.env[value]

    if (!variable || variable.trim() === "") {
        console.log(`${variable} IS MISSING IN .ENV FILE`)
    }
})

const env = {
    jwt_secret: process.env.JWT_SECRET,
    port: process.env.PORT,
    mongo_uri: process.env.MONGO_URI,
    rabbitmq_url: process.env.RABBITMQ_URL,
    internal_service_jwt_secret: process.env.INTERNAL_SERVICE_JWT_SECRET,
    user_service_url: process.env.USER_SERVICE_URL
}

module.exports = env