const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3")
const env = require("../config/env")

const s3 = new S3Client({
    region: env.aws_region,
    credentials: {
        accessKeyId: env.aws_access_key,
        secretAccessKey: env.aws_secret_key
    }
})

async function uploadAvatar(userId, svgBuffer) {
    const key = `users/${userId}/avatar/avatar.svg`

    await s3.send(new PutObjectCommand({
        Bucket: env.aws_bucket,
        Key: key,
        Body: svgBuffer,
        ContentType: "image/svg+xml",
        CacheControl: "public , max-age=31536000"
    }))

    return key
}

module.exports = { uploadAvatar }