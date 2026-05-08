const mongoose = require("mongoose")

const mediaSchema = new mongoose.Schema({
    groupId: { type: String, required: [true, "GROUPID IS REQUIRED"] },
    uploadedBy: { type: String, required: [true, "WHO UPLOAD IS REQUIRED"] },
    fileName: { type: String, required: [true, "FILENAME IS REQUIRED"] },
    fileKey: { type: String, required: [true, "FILEKEY IS REQUIRED"] },
    fileUrl: { type: String, required: [true, "FILEURL IS REQUIRED"] },
    fileType: { type: String, enum: ["image", "doc", "video", "audio", "zip"], required: [true, "FILETYPE IS REQUIRED"] },
    mimeType: { type: String, required: [true, "MIMETYPE IS REQUIRED"] },
    fileSize: { type: Number, required: [true, "FILESIZE IS REQUIRED"] },
    isActive: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model("Media", mediaSchema)