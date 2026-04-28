const mongoose = require("mongoose");
const {Schema} = mongoose;

const questionSchema = new Schema ({
    text:{
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "medium"
    },
    type: {
        type: String,
        enum: ["mcq", "descriptive"],
        default: "mcq"
    },

    options: [{
        text: {
            type: String
        },
        isCorrect: {
            type: Boolean,
            default: false
        }
    }],
    explanation: {
        type: String
    },
    marks: {
        type: Number,
        default: 1
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
    isActive: {
        type: Boolean ,
        default: true
    },
}, {timestamps: true});


module.exports = mongoose.model("Question" , questionSchema);