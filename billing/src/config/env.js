require("dotenv").config()

const requiredVariables = [
    "PORT",
    "JWT_SECRET",
    "MONGO_URI",
    "INTERNAL_SERVICE_JWT_SECRET",
    "RABBITMQ_URL",
    "RAZORPAY_API_KEY",
    "RAZORPAY_API_SECRET"
]

requiredVariables.forEach(v => {
    const variable = process.env[v]

    if (!variable || variable.trim() === "") {
        console.log(`${v} IS MISSING IN DOTENV FILE`)
    }
})

const env = {
    mongo_uri: process.env.MONGO_URI,
    port: process.env.PORT,
    jwt_secret: process.env.JWT_SECRET,
    internal_service_jwt_secret: process.env.INTERNAL_SERVICE_JWT_SECRET,
    rabbitmq_url: process.env.RABBITMQ_URL,
    razorpay_api_key: process.env.RAZORPAY_API_KEY,
    razorpay_api_secret: process.env.RAZORPAY_API_SECRET,

}

module.exports = env