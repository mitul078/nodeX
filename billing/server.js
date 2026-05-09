const connectDB = require("./src/config/db")
const env = require("./src/config/env")
const { connectRabbitMQ } = require("./src/config/rabbit")
const fastify = require("./src/fastify")
const startPlanExpiryJob = require("./src/jobs/plan-expiry.job")


async function bootstrap() {
    await connectDB()
    await connectRabbitMQ()

    startPlanExpiryJob()

    await fastify.listen({ port: env.port , host:"0.0.0.0" })
        .then(() => console.log("BILLINGSERVICE SERVER RUN AT ", env.port))
}

bootstrap().catch((err) => {
    console.log("FAILED TO START BILLINGSERVICE ", err.message)
    process.exit(1)
})