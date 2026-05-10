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
        console.log(`NODEX-AUTHSERVICE RUN AT ${env.port}`)
    })

}
bootstrap().catch(err => {
    console.log("FAILED TO START AUTH SERVICE ", err.message)
    process.exit(1)
})
