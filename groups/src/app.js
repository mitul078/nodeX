const express= require("express")
const morgan = require("morgan")
const app = express()

app.use(express.json())
app.use(morgan("dev"))

app.use("/api/v1/groups" , require("./routes/group.route"))
app.use("/api/v1/groups" , require("./routes/member.route"))

module.exports = app