require("dotenv").config()

const requiredVariables = [
    "PORT",
    "MONGO_URI",
    "RABBITMQ_URL",
    "JWT_SECRET",
    "AWS_ACCESS_KEY",
    "AWS_SECRET_KEY",
    "AWS_BUCKET",
    "AWS_REGION"
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
    jwt_secret: process.env.JWT_SECRET,
    aws_access_key: process.env.AWS_ACCESS_KEY,
    aws_secret_key: process.env.AWS_SECRET_KEY,
    aws_region: process.env.AWS_REGION,
    aws_bucket: process.env.AWS_BUCKET
}

module.exports = env