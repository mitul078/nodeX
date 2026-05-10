const error = (res, message = "SOMETHING WENT WRONG", statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
    })
}

module.exports = error