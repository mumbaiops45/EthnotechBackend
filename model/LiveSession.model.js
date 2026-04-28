const mongoose = require("mongoose");
const { Schema } = mongoose;

const liveSessionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson"
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },

    scheduledAt: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    joinLink: {
        type: String,
        required: true
    },

    platform: { type: String, enum: ["zoom", "meet", "other"], default: "meet" },
    linkActiveAt: { type: Date },
    recordingUrl: { type: String },
    recordingUploadedAt: { type: Date },

    status: {
        type: String,
        enum: ["scheduled", "live", "completed", "cancelled"],
        default: "scheduled"
    },

    reminder24Sent: { type: Boolean, default: false },
    reminder15Sent: { type: Boolean, default: false },

    notifiedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],

}, { timestamps: true });


module.exports = mongoose.model("LiveSession", liveSessionSchema);