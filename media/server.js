const connectDB = require("./src/config/db")
const env = require("./src/config/env")
const { connectRabbitMQ } = require("./src/config/rabbit")
const fastify = require("./src/fastify")


async function bootstrap() {
    await connectDB()
    await connectRabbitMQ()

    await fastify.listen({ port: env.port })
        .then(() => console.log("NODEX-MEDIASERVICE SERVER RUN AT ", env.port))
}

bootstrap().catch((err) => {
    console.log("FAILED TO START MEDIASERVICE ", err.message)
    process.exit(1)
})