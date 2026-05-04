const Auth = require("../models/auth.model")
const error = require("../utils/error")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const success = require("../utils/success")

exports.signup = async (req, res) => {
    try {

        const { username, password } = req.body

        const isUserExists = await Auth.findOne({ username })

        if (isUserExists) {
            return error(res, "USERNAME IS TAKEN", 400)
        }

        const hashPass = crypto.createHash("sha256").update(password).digest("hex")

        const user = await Auth.create({
            username,
            password: hashPass
        })

        return success(
            res,
            "USER IS CREATED",
            { username },
        )


    } catch (err) {
        return error(res, err.message)
    }
}

exports.signin = async(req , res) => {
    try {
        
        const {password} 

    } catch (err) {
        return error(res, err.message);
    }
}