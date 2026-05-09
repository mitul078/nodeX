const Razorpay = require("razorpay")
const env = require("./env")


const razorpay = new Razorpay({
    key_id: env.razorpay_api_key,
    key_secret:env.razorpay_api_secret
})

module.exports = razorpay