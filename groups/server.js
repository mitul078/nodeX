const app = require("./src/app")
const connectDB = require("./src/config/db")
const env = require("./src/config/env")
const { connectRabbitMQ } = require("./src/config/rabbit")


async function bootstrap() {
    await connectDB()
    await connectRabbitMQ()
    app.listen(env.port, () => {
        console.log(`NODEX-GROUPSERVICE RUN AT ${env.port}`)
    })

}

bootstrap().catch(err => {
    console.log("FAILED TO START GROUP SERVICE ", err.message)
    process.exit(1)
})
