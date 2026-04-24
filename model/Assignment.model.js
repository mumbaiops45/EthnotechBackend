const mongoose = require("mongoose");
const {Schema} = mongoose;

const assignmentSchema = new Schema ({
    title :{
        type: String, 
        required: true
    },
    description:{
        type: String,
    },
    type: {
        type: String, 
        enum: ["descriptive", "file-upload"],
        required: true
    },
    course: {
type: mongoose.Schema.Types.ObjectId,
ref: "Course"
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson"
    },
    moduleId: {
        type: mongoose.Schema.Types.ObjectId
    },
    deadline: {
        type:Date,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    passingMarks : {
        type: Number,
        required: true
    },
    assignTo: {
        type: String,
        enum: ["batch" , "all"],
        default: "all"
    },
    batch: {
        type: String
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instructor"
    },  
}, {timestamps: true});


module.exports = mongoose.model("Assignment", assignmentSchema);