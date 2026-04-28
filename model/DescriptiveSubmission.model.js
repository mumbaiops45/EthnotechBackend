const mongoose = require("mongoose");
const {Schema} = mongoose;


const descriptiveSubmissionSchema = new Schema ({
    assessment: {
        type:mongoose.Schema.Types.ObjectId,
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
    textContent: {
        type: String
    },
    fileUrl: {
        type: String,
    },
    fileType: {
        type: String,
        enum: ["pdf", "doc", "image", "other"]
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },

    marks: {
        type: Number,
    },
    totalMarks:{
        type: Number
    },
    percentage: {
        type: Number
    },
    feedback: {
        type: String
    },
    gradeBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
    isPassed: {
        type: Boolean
    },

    status:{
        type: String,
        enum: ["pending", "reviewed", "published"],
        default: "pending"
    },
}, {timestamps: true});


module.exports = mongoose.model("DescriptiveSubmission" , descriptiveSubmissionSchema);