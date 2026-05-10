const fastify = require("fastify")({ logger: true })
const proxy = require("@fastify/http-proxy")
const env = require("./config/env")

fastify.register(proxy, {
    upstream: env.auth_service_url,
    prefix: "/api/v1/auth",
    rewritePrefix: "/api/v1/auth"
})

fastify.register(proxy, {
    upstream: env.users_service_url,
    prefix: "/api/v1/users",
    rewritePrefix: "/api/v1/users"
})

fastify.register(proxy, {
    upstream: env.groups_service_url,
    prefix: "/api/v1/groups",
    rewritePrefix: "/api/v1/groups"
})

fastify.register(proxy, {
    upstream: env.media_service_url,
    prefix: "/api/v1/media",
    rewritePrefix: "/api/v1/media"
})

fastify.register(proxy, {
    upstream: env.billing_service_url,
    prefix: "/api/v1/billing",
    rewritePrefix: "/api/v1/billing"
})

module.exports = fastify