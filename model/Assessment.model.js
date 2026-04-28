const mongoose = require("mongoose");
const {Schema} = mongoose;

const assessmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description : {
        type: String
    },
    type: {
        type: String,
        enum: ["mcq", "descriptive"],
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
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch"
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    questions: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true
        },
        marks: {
            type: Number, 
            required: true
        },
    }],

    useQuestionBank: {
        type: Boolean,
        default: false
    },
    bankFilters: {
        subject: {type: String},
        topic: {type: String},
        difficulty: {type: String},
        count: { type: Number}
    },

    totalMarks: {
        type: Number,
        default: 0
    },
    passingPercent: {
        type: Number , 
        default: 40
    },

    timeLimitMinutes: {
        type: Number,
        default: null
    },
    autoSubmitOnTimeout: {
        type: Boolean ,
        default: true
    },

    shuffleQuestions: {
        type: Boolean, 
        default: false
    },
    showCorrectAnswers: {
        type: Boolean,
        default: true
    },
    maxRetakes: {
        type: Number,
        default: 0
    },
    cooldownHours: {
        type: Number,
        default: 24
    },
    deadline: {type: Date},
    isPublished: {
        type:Booean,
        default: false
    },

},{timestamps: true});

module.exports = mongoose.model("Assessment", assessmentSchema);