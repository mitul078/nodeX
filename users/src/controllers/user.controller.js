const User = require("../models/user.model");
const error = require("../utils/error");
const success = require("../utils/success");


//protected
exports.me = async (req, res) => {
    try {

        const user = await User.findOne({ userId: req.user.userId })

        return success(res, "USER FETCHED", { user }, 200)

    } catch (err) {
        return error(res, err.message);
    }
}