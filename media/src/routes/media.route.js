const { uploadMedia, getGroupMedia, deleteMedia } = require("../controllers/media.controller")
const authHook = require("../hooks/auth.hook")

async function mediaRoutes(fastify, options) {
    fastify.addHook("onRequest", authHook)

    fastify.post("/:groupId/upload",uploadMedia)
    fastify.get("/:groupId", getGroupMedia)
    fastify.delete("/:mediaId", deleteMedia)
}

module.exports = mediaRoutes