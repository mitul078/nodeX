const { generateAvatar } = require("../utils/avatar");
const { uploadAvatar } = require("./s3.service");

async function createAndUploadAvatar(userId, name) {

    const svg = generateAvatar(name, userId)

    const buffer = Buffer.from(svg, "utf-8")

    const avatarUrl = await uploadAvatar(userId, buffer)

    return avatarUrl

}

module.exports = {createAndUploadAvatar}