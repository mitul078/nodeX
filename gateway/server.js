const env = require("./src/config/env")
const fastify = require("./src/fastify")

async function bootstrap() {
    await fastify.listen({ port: env.port }).then(() => {
        console.log("NODEX-APIGATEWAY RUNNING ON ", env.port)
    })
}

bootstrap().catch(err => console.log("FAILED TO START NODEX-APIGATEWAY", err))