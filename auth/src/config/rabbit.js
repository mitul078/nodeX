const amqplib = require("amqplib");
const env = require("./env");

let connection, channel

async function connectMQ() {
    if (connection) return connection;

    try {

        connection = await amqplib.connect(env.rabbitmq_url)
        console.log("NODEX-AUTHSERVICE RABBITMQ CONNECTED")

        channel = await connection.createChannel()

    } catch (error) {
        console.log("NODEX-AUTHSERVICE RABBITMQ ERROR", error)
    }

}

async function publishToQueue(queueName, data = {}) {
    if (!channel || !connection) {
        await connectMQ()
    }

    await channel.assertQueue(queueName, { durable: true })

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)))

}

async function subscribeToQueue(queueName, cb) {

    if (!channel || !connection) {
        await connectMQ()
    }

    await channel.assertQueue(queueName, { durable: true })

    channel.consume(queueName, async (msg) => {
        if (msg !== null) {
            const data = JSON.parse(msg.content.toString())
            await cb(data)
            channel.ack(msg)
        }
    })

}

module.exports = {
    connectMQ,
    publishToQueue,
    subscribeToQueue
}