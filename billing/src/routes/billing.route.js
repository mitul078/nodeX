
const { webhook, createOrder, verifyPayment, getPlan, getTransaction } = require("../controllers/billing.controller")
const authHook = require("../hooks/auth.hook")


async function billingRoutes(fastify, options) {

    fastify.post("/webhook", webhook)
    fastify.addHook("onRequest", authHook)
    fastify.post("/create-order", createOrder)
    fastify.post("/verify-payment", verifyPayment)
    fastify.get("/my-plan", getPlan)
    fastify.get("/transactions", getTransaction)

}

module.exports = billingRoutes