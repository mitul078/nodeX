const express = require("express")
const morgan = require("morgan")
const app = express()

app.use(express.json())
app.use(morgan("dev"))

app.use("/api/v1/users" , require("./routes/user.route"))

module.exports = app