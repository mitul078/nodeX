const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3")
const env = require("../config/env")

const s3 = new S3Client({
    region: env.aws_region,
    credentials: {
        accessKeyId: env.aws_access_key,
        secretAccessKey: env.aws_secret_key
    }
})

exports.uploadToS3 = async ({ buffer, fileKey, mimeType }) => {
    await s3.send(new PutObjectCommand({
        Bucket: env.aws_bucket,
        Key: fileKey,
        Body: buffer,
        ContentType: mimeType
    }))

    return `https://${env.aws_bucket}.s3.${env.aws_region}.amazonaws.com/${fileKey}`
}

exports.deleteFromS3 = async (fileKey) => {
    await s3.send(new DeleteObjectCommand({
        Bucket: env.aws_bucket,
        Key: fileKey
    }))
}