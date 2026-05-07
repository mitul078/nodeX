const mongoose = require("mongoose")
const memberSchema = new mongoose.Schema({
    
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: [true, "GROUPID IS REQUIRED"] },

    userId: { type: String, required: [true, "USERID IS REQUIRED"] },

    addedBy:{type:String, required:[true, "WHO ADDED IS REQUIRED"]},

    isActive:{type:Boolean , default:true}

})

memberSchema.index({groupId:1 , userId:1} , {unique:true})

module.exports = mongoose.model("Member" , memberSchema)