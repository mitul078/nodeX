const env = require("../config/env")
const razorpay = require("../config/razorpay")
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

        const order = await razorpay.orders.create({
            amount: PLAN[plan].amount,
            currency: "INR",
            receipt: `receipt_${userId}_${Date.now()}`
        })

        await Transaction.create({
            userId,
            orderId: order.id,
            amount: PLAN[plan].amount,
            plan,
            status: "pending"
        })

        return reply.code(201).send({
            success: true,
            message: "ORDER CREATED",
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                keyId: env.razorpay_api_key
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
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = request.body

        const body = razorpay_order_id + "|" + razorpay_payment_id
        const expected = crypto.createHmac("sha256", env.razorpay_api_secret).update(body).digest("hex")

        if (expected !== razorpay_signature) {
            return reply.code(400).send({
                success: false,
                message: "INVALID PAYMENT SIGNATURE"
            })
        }

        const transaction = await Transaction.findOne({ orderId: razorpay_order_id, userId })
        if (!transaction) return reply.code(404).send({ success: false, message: "TRANSACTION NOT FOUND" })

        transaction.paymentId = razorpay_payment_id
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

        const signature = request.headers["x-razorpay-signature"]
        const body = JSON.stringify(request.body)

        const expected = crypto.createHmac("sha256", env.razorpay_api_secret).update(body).digest("hex")
        if (expected !== signature) {
            return reply.code(400).send({
                success: false,
                message: "INVALID WEBHOOK SIGNATURE"
            })
        }

        const event = request.body.event
        if (event === "payment.captured") {
            const payment = request.body.payload.payment.entity
            const orderId = payment.order_id

            const transaction = await Transaction.findOne({ orderId })
            if (!transaction || transaction.status === "success") {
                return reply.code(200).send({ message: "received" })
            }

            transaction.paymentId = payment.id
            transaction.status = "success"
            await transaction.save()

            const expiresAt = new Date()
            expiresAt.setDate(expiresAt.getDate() + 30)

            const plan = await Plan.findOneAndUpdate({ userId: transaction.userId }, { plan: transaction.plan, expiresAt, isActive: true }, { upsert: true })

        }


        return reply.code(200).send({ received: true })

    } catch (error) {
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
                amount: t.amount,
                plan: t.plan,
                status: t.status,
                createdAt: t.createdAt
            }))
        })


    } catch (error) {
        return reply.code(500).send({ error: error.message })

    }
}