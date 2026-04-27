const mongoose = require("mongoose");
const { Schema } = mongoose;

const liveSessionSchema = new Schema({
    title: {
        title: String,
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
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    date: {
        type: Date ,
        required: true
    },
    duration: {
        type: Number , required: true
    },
    meetLink: {
        type: String
    },
    status: {
        type: String,
        enum: ["scheduled", "live", "completed", "cancelled"],
        default: "scheduled"
    },
    notifiedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student"}],

}, {timestamps: true});


module.exports = mongoose.model("LiveSession" , loveSessionSchema);