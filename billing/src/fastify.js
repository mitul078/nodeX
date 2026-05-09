const fastify = require("fastify")()

fastify.register(require("@fastify/formbody"))

fastify.addContentTypeParser(
    "application/json",
    { parseAs: "buffer" },
    (req, body, done) => {
        req.rawBody = body.toString()

        try {

            done(null, JSON.parse(body))

        } catch (error) {
            done(error)
        }
    }
)

fastify.register(require("./routes/billing.route"), {
    prefix: "/api/v1/billing"
})

module.exports = fastify