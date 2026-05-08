const fastify = require("fastify")()

fastify.register(require("@fastify/multipart"), {
    limits: {
        fileSize: 50 * 1024 * 1024 //50mb
    }
})

fastify.register(require("./routes/media.route") , {
    prefix:"/api/v1/media"
})

module.exports = fastify