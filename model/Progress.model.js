const mongoose = require("mongoose");
const {Schema} = mongoose;

const progressSchema = new Schema({
    student :{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Student",
        required: true
    },
    course : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    batch: {
         type: mongoose.Schema.Types.ObjectId,
          ref: "Batch" 
    },
    lessons:[{
        lesson: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson"
        },
        watchPercent: {
            type: Number, default: 0
        },
        isCompleted: {
            type:Boolean ,
            default: false
        },
    }],
    assignments: [{
        assignment :{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment"
        },
        submitted: {
            type: Boolean ,
            default: false
        },
        score: {
            type: Number
        },
    }],
    attendancePercent: {
        type: Number,
        default: 0
    },
    overallCompletion: {
        type: Number , 
        default: 0
    },
} ,{timestamps: true}) ;

progressSchema.index({ student: 1, course: 1 }, { unique: true });


module.exports = mongoose.model("Progress" , progressSchema);