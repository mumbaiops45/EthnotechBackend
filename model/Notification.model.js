const mongoose = require("mongoose");
const {Schema} = mongoose;

const notificationSchema = new Schema ({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    title: {
        type: String, 
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["live_class" , "assignment", "announcement", "result", "general"],
        default: "general"
    },
    refId: {
        type: mongoose.Schema.Types.ObjectId
    },
    isRead: {
        type: Boolean,
        default: false
    },
},{timestamps: true});

notificationSchema.index({ student: 1 , isRead: 1});
notificationSchema.index({ student: 1 , createdAt: -1});

module.exports = mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);