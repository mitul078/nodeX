const Auth = require("../models/auth.model")
const error = require("../utils/error")
const jwt = require("jsonwebtoken")
const success = require("../utils/success")
const env = require("../config/env")
const bcrypt = require("bcrypt")


exports.signup = async (req, res) => {
    try {

        const { username, password, email } = req.body

        const isUserExists = await Auth.findOne({
            $or: [
                { email },
                { username }
            ]
        })

        if (isUserExists) {
            return error(res, "USER IS ALREADY EXISTS", 400)
        }

        const hashPass = await bcrypt.hash(password, 10)

        const user = await Auth.create({
            username,
            password: hashPass,
            email
        })

        return success(
            res,
            "USER IS CREATED",
            { username, email },
            201
        )


    } catch (err) {
        return error(res, err.message)
    }
}

exports.signin = async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await Auth.findOne({
            username
        })

        if (!user) {
            return error(res, "USER IS NOT REGISTERED", 400)
        }

        const isValidPass = await bcrypt.compare(password, user.password)

        if (!isValidPass) {
            return error(res, "CREDENTIALS ARE WRONG", 400)
        }

        const refreshToken = jwt.sign({
            userId: user._id,
            email: user.email,
            username: user.username
        }, env.jwt_secret, { expiresIn: "7d" })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const accessToken = jwt.sign({
            userId: user._id,
            email: user.email,
            username: user.username
        }, env.jwt_secret, { expiresIn: "15m" })

        return success(
            res,
            "SIGNIN SUCCESSFUL",
            { accessToken, username },
            200
        )

    } catch (err) {
        return error(res, err.message);
    }
}

exports.refreshToken = async (req, res) => {
    try {

        const refreshToken = req.cookies?.refreshToken

        if (!refreshToken) return error(res, "REFRESH TOKEN MISSING", 401)

        const decoded = jwt.verify(refreshToken, env.jwt_secret)

        const isUserExists = await Auth.findById(decoded.userId)
        if (!isUserExists) return error(res, "USER NOT FOUND", 401)

        const newRefreshToken = jwt.sign({
            userId: decoded.userId,
            email: decoded.email,
            username: decoded.username
        }, env.jwt_secret, { expiresIn: "7d" })

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const accessToken = jwt.sign({
            userId: decoded.userId,
            email: decoded.email,
            username: decoded.username
        }, env.jwt_secret, { expiresIn: "15m" })


        return success(res, "TOKEN REFRESHED", { accessToken }, 200)

    } catch (err) {
        return error(res, err.message);
    }
}

exports.signout = async (req, res) => {
    try {


        res.clearCookie("refreshToken")

        return success(res, "SIGNOUT SUCCESSFUL", {}, 200)

    } catch (err) {
        return error(res, err.message);
    }
}

exports.getMe = async (req, res) => {
    try {
        const user = await Auth.findById(req.user.userId).select("-password")

        if (!user) return error(res, "USER NOT FOUND", 404)

        return success(res, "USER FETCHED", { user }, 200)

    } catch (err) {
        return error(res, err.message);
    }
}