require("dotenv").config()

const requiredVariables = [
    "PORT",
    "MONGO_URI",
    "JWT_SECRET"
]

requiredVariables.forEach((value) => {
    const variable = process.env[value]

    if (!variable || variable.trim() === "") {
        throw new Error(`${value} IS NOT EXISTS IN .ENV FILE`)
    }
})

const env = {
    port: process.env.PORT,
    mongo_uri: process.env.MONGO_URI,
    jwt_secret: process.env.JWT_SECRET
}

module.exports = env