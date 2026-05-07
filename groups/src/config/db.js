const mongoose = require("mongoose")
const env = require("./env")

async function connectDB() {
    await mongoose.connect(env.mongo_uri)
        .then(() => console.log("NODEX-GROUPSERVICE DATABASE CONNECTED"))
        .catch(err => console.log("NODEX-GROUPSERVICE DATABASE ERROR", err))
}

module.exports = connectDB