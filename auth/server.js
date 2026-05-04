const app = require("./src/app")
const connectDB = require("./src/config/db")
const env = require("./src/config/env")


connectDB()

app.listen(env.port, () => {
    console.log(`NODEX-AUTHSERVICE RUN AT ${env.port}`)
})