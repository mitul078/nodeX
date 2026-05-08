const mongoose = require("mongoose")
const env = require("./env")

async function connectDB() {
    await mongoose.connect(env.mongo_uri)
        .then(() => console.log("NODEX-MEDIASERVICE DATABASE CONNECTED"))
        .catch(err => console.log("NODEX-MEDIASERVICE DATABASE ERROR", err))
}

module.exports = connectDB