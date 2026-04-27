const mongoose = require("mongoose");
const {Schema} = mongoose;

const submissionSchema = new Schema ({
    assignment :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
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

    content: {
        type: "String"
    },
    fileUrl: {
        type: "String"
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },


    marks: {
        type: Number
    },
    feedback: {
        type: String
    },
    gradedAt: {
        type: Date
    },
    gradedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },

    status:{
        type: String,
        enum: ["pending", "reviewed", "published"],
        default: "pending"
    },
    isPassed: {type: Boolean},

},{timestamps: true});


module.exports = mongoose.model("AssignmentSubmission" , submissionSchema);

