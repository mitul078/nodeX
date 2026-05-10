module.exports = {
    free: {
        maxGroups: 3,
        maxMembers: 10,
        maxStorageMB: 1024, //1GB
        maxFileSizeMB: 25,
        allowedType: ["image", "doc"]
    },
    pro: {
        maxGroups: 20,
        maxMembers: 50,
        maxStorageMB: 25600, //25GB
        maxFileSizeMB: 100,
        allowedType: ["image", "doc", "video"]
    },
    business: {
        maxGroups: Infinity,
        maxMembers: 500,
        maxStorageMB: 102400, //100GB
        maxFileSizeMB: 500,
        allowedType: ["image", "doc", "video", "audio", "zip"]
    }

}