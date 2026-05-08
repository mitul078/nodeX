const Media = require("../models/media.model");
const { checkMember } = require("../services/group.service");
const { uploadToS3, deleteFromS3 } = require("../services/storage.service");
const { getFileType } = require("../utils/fileType");


//protected POST /:groupId
exports.uploadMedia = async (request, reply) => {
    try {

        const userId = request.user.userId
        const { groupId } = request.params

        const valid = await checkMember(userId, groupId)

        if (!valid) return reply.code(403).send({ success: false, message: "YOU ARE NOT IN GROUP" })

        const data = await request.file()
        if (!data) return reply.code(400).send({
            success: false,
            message: "NO FILE PROVIDED"
        })

        const buffer = await data.toBuffer()
        const fileName = data.filename
        const mimeType = data.mimetype
        const fileSize = buffer.length

        const fileType = getFileType(mimeType)
        if (!fileType) return reply.code(400).send({
            success: false,
            message: "FILE TYPE NOT ALLOWED"
        })

        const fileKey = `groups/${groupId}/media/${fileType}/${Date.now()}-${fileName}`

        const fileUrl = await uploadToS3({ buffer, fileKey, mimeType })

        const media = await Media.create({
            groupId,
            fileName,
            fileSize,
            fileKey,
            fileUrl,
            mimeType,
            fileType,
            uploadedBy: userId
        })

        return reply.code(201).send({
            success: true,
            message: "FILE UPLOADED",
            data: {
                groupId,
                fileName: media.fileName,
                fileSize: media.fileSize,
                fileKey: media.fileKey,
                fileUrl: media.fileUrl,
                uploadedBy: media.uploadedBy,
                uploadedAt: media.createdAt
            }
        })

    } catch (err) {
        return reply.send({ message: err.message });
    }
}

//protected GET /:groupId
exports.getGroupMedia = async (request, reply) => {
    try {

        const { groupId } = request.params
        const userId = request.user.userId

        const valid = await checkMember(userId, groupId)
        if (!valid) return reply.code(403).send({
            success: false,
            message: "YOU ARE NOT IN GROUP"
        })

        const allMedia = await Media.find({ groupId, isActive: true }).sort({ createdAt: -1 })

        return reply.code(200).send({
            success: true,
            message: "MEDIA FETCHED",
            data: allMedia.map(m => ({
                mediaId: m._id,
                fileName: m.fileName,
                fileUrl: m.fileUrl,
                fileType: m.fileType,
                fileSize: m.fileSize,
                uploadedBy: m.uploadedBy,
                uploadedAt: m.createdAt
            }))
        })

    } catch (error) {
        reply.code(500).send({
            success: false,
            message: error.message
        })

    }
}

//protected DELETE /:mediaId
exports.deleteMedia = async (request, reply) => {
    try {

        const userId = request.user.userId
        const { mediaId } = request.params

        const mediaDoc = await Media.findOne({ _id: mediaId, isActive: true })
        if (!mediaDoc) return reply.code(404).send({
            success: false,
            message: "MEDIA NOT FOUND"
        })

        const uploader = mediaDoc.uploadedBy === userId
        if (!uploader) return reply.code(403).send({
            success: false,
            message: "YOU ARE NOT ALLOWED TO DELETE"
        })

        mediaDoc.isActive = false
        await mediaDoc.save()
        await deleteFromS3(mediaDoc.fileKey)


        return reply.code(200).send({
            success: true,
            message: "FILE DELETED"
        })

    } catch (error) {
        return reply.code(500).send({
            success: false,
            message: error.message
        })

    }
}

