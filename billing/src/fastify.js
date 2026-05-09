const fastify = require("fastify")({ logger: true })

fastify.register(require("@fastify/formbody"))

fastify.register(require("./routes/billing.route"), {
    prefix: "/api/v1/billing"
})

module.exports = fastify