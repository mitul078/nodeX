const env = require("../config/env")
const stripe = require("../config/stripe")
const Plan = require("../models/plan.model")
const Transaction = require("../models/transaction.model")
const { PLAN } = require("../utils/plan")
const crypto = require("crypto")

exports.createOrder = async (request, reply) => {
    try {

        const userId = request.user.userId
        const { plan } = request.body


        if (!PLAN[plan]) {
            return reply.code(400).send({
                success: false,
                message: "INVALID PLAN"
            })
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: PLAN[plan].amount,
            currency: "INR",
            metadata: { userId, plan }
        })

        await Transaction.create({
            userId,
            orderId: paymentIntent.id,
            amount: PLAN[plan].amount,
            plan,
            status: "pending"
        })

        return reply.code(201).send({
            success: true,
            message: "ORDER CREATED",
            data: {
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                clientSecret: paymentIntent.client_secret
            }
        })


    } catch (error) {
        return reply.code(500).send({
            success: false,
            error: error.message
        })

    }
}

exports.verifyPayment = async (request, reply) => {
    try {

        const { userId } = request.user
        const { paymentIntentId } = request.body

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
        if (paymentIntent.status !== "succeeded") {
            return reply.code(400).send({
                success: false,
                message: "PAYMENT NOT SUCCESSFUL"
            })
        }

        const transaction = await Transaction.findOne({ orderId: paymentIntentId, userId })
        if (!transaction) return reply.code(404).send({ success: false, message: "TRANSACTION NOT FOUND" })

        transaction.paymentId = paymentIntentId
        transaction.status = "success"
        await transaction.save()

        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 30)

        await Plan.findOneAndUpdate({ userId }, {
            plan: transaction.plan,
            isActive: true,
            expiresAt
        }, { upsert: true })

        return reply.code(200).send({
            success: true,
            message: "PAYMENT VERIFIED",
            data: {
                plan: transaction.plan,
                expiresAt
            }
        })

    } catch (error) {
        return reply.code(500).send({
            success: false,
            message: error.message
        })

    }
}

exports.webhook = async (request, reply) => {
    try {

        const signature = request.headers["stripe-signature"]
        const body = JSON.stringify(request.body)



        const event = stripe.webhooks.constructEvent(
            request.rawBody,
            signature,
            env.stripe_webhook_secret
        )

        console.log("EVENT TYPE:", event.type)

        if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object

            console.log("PAYMENT INTENT:", paymentIntent.id)        // ← payment id
            console.log("METADATA:", paymentIntent.metadata)


            const { userId, plan } = paymentIntent.metadata

            console.log("USERID:", userId)    // ← is this populated?
            console.log("PLAN:", plan)

            const transaction = await Transaction.findOne({ orderId: paymentIntent.id })
            if (!transaction || transaction.status === "success") {
                return reply.code(200).send({ received: true })
            }

            console.log("TRANSACTION:", transaction)


            transaction.paymentId = paymentIntent.id
            transaction.status = "success"
            await transaction.save()

            console.log("TRANSACTION SAVED")   //

            const expiresAt = new Date()
            expiresAt.setDate(expiresAt.getDate() + 30)

            await Plan.findOneAndUpdate(
                { userId },
                { plan, expiresAt, isActive: true },
                { upsert: true }
            )

            console.log("PLAN UPDATED")
        }

        return reply.code(200).send({ received: true })


    } catch (error) {
        console.error("WEBHOOK ERROR:", err.message)
        return reply.code(500).send({
            success: false,
            message: error.message
        })

    }
}

exports.getPlan = async (request, reply) => {
    try {

        const { userId } = request.user
        const plan = await Plan.findOne({ userId })
        if (!plan) {
            return reply.code(200).send({
                success: true,
                message: "PLAN FETCHED",
                data: {
                    plan: "free",
                    expiresAt: null
                }
            })
        }

        return reply.code(200).send({
            success: true,
            message: "PLAN FETCHED",
            data: {
                plan: plan.plan,
                expiresAt: plan.expiresAt
            }
        })

    } catch (error) {
        return reply.code(500).send({ error: error.message })

    }
}

exports.getTransaction = async (request, reply) => {
    try {

        const { userId } = request.user
        const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 })

        return reply.code(200).send({
            success: true,
            message: "TRANSACTION FETCHED",
            data: transactions.map(t => ({
                orderId: t.orderId,
                paymentId: t.paymentId,
                amount: t.amount / 100,
                plan: t.plan,
                status: t.status,
                createdAt: t.createdAt
            }))
        })


    } catch (error) {
        return reply.code(500).send({ error: error.message })

    }
}