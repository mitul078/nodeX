require("dotenv").config()

const requiredVariables = [
    "PORT",
    "JWT_SECRET",
    "MONGO_URI",
    "AWS_ACCESS_KEY",
    "AWS_SECRET_KEY",
    "AWS_BUCKET",
    "AWS_REGION",
    "INTERNAL_SERVICE_JWT_SECRET",
    "RABBITMQ_URL",
    "GROUP_SERVICE_URL"
]

requiredVariables.forEach(v => {
    const variable = process.env[v]

    if (!variable || variable.trim() === "") {
        console.log(`${variable} IS MISSING IN DOTENV FILE`)
    }
})

const env = {
    mongo_uri: process.env.MONGO_URI,
    port: process.env.PORT,
    jwt_secret: process.env.JWT_SECRET,
    aws_access_key: process.env.AWS_ACCESS_KEY,
    aws_secret_key: process.env.AWS_SECRET_KEY,
    aws_region: process.env.AWS_REGION,
    aws_bucket: process.env.AWS_BUCKET,
    internal_service_jwt_secret: process.env.INTERNAL_SERVICE_JWT_SECRET,
    rabbitmq_url: process.env.RABBITMQ_URL,
    group_service_url: process.env.GROUP_SERVICE_URL
}

module.exports = env