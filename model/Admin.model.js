const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: {
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
    }
})