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
    }
},{timestamps: true});

module.exports = mongoose.model("Notification", notificationSchema);