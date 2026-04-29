const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
  },
  photo: { type: String },
  dob: { type: Date },
  gender: {
    type: String, enum: ["Male", "Female", "Other"],
    required: true
  },
  education: { type: String },
  program: { type: String },
  branch: { type: String },

}, { _id: false });

const studentSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    mobile: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },

    profile: profileSchema,
    role: {
      type: String,
      enum: ["Student"],
      default: "Student"
    },

    otp: {
      code: String,

    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);