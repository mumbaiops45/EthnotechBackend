const mongoose = require("mongoose");
const {Schema} = mongoose;

const instructorSchema = new Schema({
  adminRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  photo: {
    type: String
  },
  bio: {
    type: String
  },
  specialisation: [{type: String}],
  assignedPrograms: [{type: String}],
  assignedBatches: [ {type: String}],
  isActive: {type: Boolean, default: true},
}, {timestamps: true});

module.exports = mongoose.model("Instructor", instructorSchema);