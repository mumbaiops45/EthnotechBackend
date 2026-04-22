

const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    mobile: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },

    profile: {
      photo: String,
      dob: Date,
      gender: String,
      education: String,
      program: String,
      branch: String,
    },

    otp: {
      code: String,
      
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);