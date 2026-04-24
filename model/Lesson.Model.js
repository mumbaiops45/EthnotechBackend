const mongoose = require("mongoose");
const { Schema } = mongoose;

const lessonSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    videoUrl : {
        type: String
    },
    videoFile : {
        type: String
    },
    resources: [{
        name: String,
        url: String
    }],
    isMandatory: {
        type: Boolean ,
        default: true
    },
    minWatchPercent: {
        type: Number, 
        default: 80
    },
    order: {
        type: Number,
        default: 0
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    moduleId: {
        type: mongoose.Schema.Types.ObjectId
    },
}, {timestamps: true});


module.exports = mongoose.model("Lesson", lessonSchema);