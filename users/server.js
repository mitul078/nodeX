const app = require("./src/app")
const connectDB = require("./src/config/db")
const env = require("./src/config/env")
const { connectMQ } = require("./src/config/rabbit")
const setListeners = require("./src/config/listeners")


async function bootstrap() {
    await connectDB()
    await connectMQ().then(() => {
        setListeners()
    })
    app.listen(env.port, () => {
        console.log(`NODEX-USERSERVICE RUN AT ${env.port}`)
    })
}

bootstrap().catch(err => {
    console.log("FAILED TO START USER SERVICE ", error.message)
    process.exit(1)
})
