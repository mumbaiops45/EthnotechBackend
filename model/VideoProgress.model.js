
const mongoose = require("mongoose");

const videoProgressSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    lastPosition: {
        type: Number,
        default: 0
    },
    totalDuration: {
        type: Number,
        default: 0
    },
    watchPercent: {
        type: Number,
        default: 0
    },
    isCompleted: {
        type: Boolean ,
        default: false
    },

    sessions: [{
        startedAt: {
            type: Date
        },
        endedAt: {
            type: Date
        },
        position: {
            type: Number
        },
    }],

    lastSavedAt: {
        type: Date, 
        default: Date.now
    },
}, {timestamps: true});


videoProgressSchema.index({ student: 1, lesson: 1 }, { unique: true });

module.exports = mongoose.model("VideoProgress", videoProgressSchema);