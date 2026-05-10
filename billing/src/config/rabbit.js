const amqplib = require("amqplib")
const env = require("./env")

let connection = null
let channel = null

async function connectRabbitMQ() {
    if (connection) return connection

    try {

        connection = await amqplib.connect(env.rabbitmq_url)
        console.log("NODEX-BILLINGSERVICE RABBITMQ CONNECTED")

        channel = await connection.createChannel()

    } catch (error) {
        console.log("NODEX-BILLINGSERVICE RABBITMQ ERROR", error)
    }
}

async function publishToQueue(queueName, data = {}) {

    if (!channel || !connection) {
        await connectRabbitMQ()
    }

    await channel.assertQueue(queueName, { durable: true })

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)))

}

async function subscribeToQueue(queueName, cb) {
    if (!connection || !channel) {
        await connectRabbitMQ()
    }

    await channel.assertQueue(queueName, { durable: true })

    channel.consume(queueName, async (msg) => {
        if (!msg) return
        try {

            const data = JSON.parse(msg.content.toString())
            await cb(data)
            channel.ack(msg)

        } catch (error) {
            channel.nack(msg, false, false)

        }
    })
}

module.exports = {
    connectRabbitMQ,
    publishToQueue,
    subscribeToQueue
}