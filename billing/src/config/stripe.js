const Stripe = require("stripe")
const env = require("./env")

module.exports = new Stripe(env.stripe_secret_key)