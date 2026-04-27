const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    fullName: {
        type: String, 
        required: true
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        unique:  true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["SuperAdmin","BranchAdmin", "Instructor"],
        default: "BranchAdmin",
    },
    gender: { type: String, enum: ["Male", "Female", "Other"],
      required: true
     },
    branch: {type: String},
    isActive: {type:Boolean, default: true},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Admin"
    },
}, {timestamps: true});

module.exports = mongoose.model("Admin", adminSchema);