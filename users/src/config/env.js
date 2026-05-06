require("dotenv").config()

const requiredVariables = [
    "PORT",
    "MONGO_URI",
    "RABBITMQ_URL",
    "JWT_SECRET"
]

requiredVariables.forEach((value) => {
    const variable = process.env[value]
    if (!variable || variable.trim() === "") {
        throw new Error(`${value} IS NOT EXISTS IN .ENV FILE`)
    }
})

const env = {
    mongo_uri: process.env.MONGO_URI,
    port: process.env.PORT,
    rabbitmq_url: process.env.RABBITMQ_URL,
    jwt_secret: process.env.JWT_SECRET
}

module.exports = env