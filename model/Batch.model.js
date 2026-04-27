const mongoose = require("mongoose");
const { Schema } = mongoose;

const batchSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    program: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }],
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },

},{timestamps: true});


module.exports = mongoose.model("Batch", batchSchema);