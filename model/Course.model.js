const mongoose = require("mongoose");
const {Schema} = mongoose;

const moduleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson"
    }]
});


const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type:String
    },
    coverImage: {
        type: String
    },
    category: {
        type: String
    },
    program: {
        type: String
    },
    batch: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Batch"
},
    instructor:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
        required: true
    }],
    modules: [moduleSchema],
    isPublished: {type: Boolean, default: false},
}, {timestamps: true});


module.exports = mongoose.model("Course", courseSchema);