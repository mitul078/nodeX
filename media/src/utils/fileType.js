export function getFileType(mimeType) {
    if (mimeType.startsWith("image/")) return "image"
    if (mimeType.startsWith("video/")) return "video"
    if (mimeType.startsWith("audio/")) return "audio"
    if (mimeType === "application/pdf") return "doc"
    if (mimeType === "application/msword") return "doc"
    if (mimeType.includes("spreadsheet")) return "doc"
    if (mimeType.includes("presentation")) return "doc"
    if (mimeType.includes("zip")) return zip

    return null

}