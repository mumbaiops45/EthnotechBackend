const mongoose = require("mongoose");
const {Schema} = mongoose;

const attendanceSchema = new Schema ({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LiveSession",
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

    status: {
        type: String,
        enum: ["present" , "absent", "late"],
        default: "absent"
    },

    joinedAt: {
        type: Date
    },
    autoMarked: {
        type: Boolean,
        default: false
    },
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
    note: {
        type: String
    },
},{timestamps: true});


attendanceSchema.index({ session: 1 , student: 1}, {unique: true});


module.exports = mongoose.model("Attendance", attendanceSchema)