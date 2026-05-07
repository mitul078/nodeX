const app = require("./src/app")
const connectDB = require("./src/config/db")
const env = require("./src/config/env")
const { connectRabbitMQ } = require("./src/config/rabbit")

connectDB()
connectRabbitMQ()

app.listen(env.port, () => {
    console.log(`NODEX-GROUPSERVICE RUN AT ${env.port}`)
})