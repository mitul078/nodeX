const cookieParser = require("cookie-parser")
const express = require("express")
const morgan = require("morgan")
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))

app.use("/api/v1/auth", require("./routes/auth.route"))

module.exports = app