const mongoose = require('mongoose');
const {Schema} = mongoose;


const announcementSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    targetType: {
        type: String,
        enum: ["batch", "course", "all"],
        required: true
    },


    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch"
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    sentTo:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }],
    channels: {
        inApp: { type: Boolean , default : true},
        email: {type: Boolean , default: true},
        sms: {type: Boolean , default: false},
    },
}, {timestamps: true});


module.exports = mongoose.model("Anncuncement", announcementSchema);