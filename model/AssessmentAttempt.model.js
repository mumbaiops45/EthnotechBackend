const mongoose = require("mongoose");
const {Schema} = mongoose;

const attemptSchema = new Schema({
    assessment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assessment",
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch"
    },

    attemptNUmber: {
        type: Number,
        default: 1
    },

    answers: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question"
        },
        selectedOption: {
            type: Number
        },
        isCorrect: {
            type: Boolean
        },
        marksAwarded: {
            type: Number,
            default: 0
        },
    }],
    startedAt: {
        type: Date,
        default: Date.now
    },
    submittedAt: {
        type: Date
    },
    timeTakenSeconds: {
        type: Number
    },
    autoSubmitted: {
        type: Boolean,
        default: false
    },

    totalMarks: {
        type: Number
    },
    scoredMarks:  {
        type: Number
    },
    percentage: {
        type: Number
    },
    isPassed: {
        type: Boolean
    },
    status: {
        type: String,
        enum: ["in-progress", "submitted", "graded"],
        default: "in-progress"
    },
},{timestamps: true});


module.exports = mongoose.model("AssessmentAttempt", attemptSchema);