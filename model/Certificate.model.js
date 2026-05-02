const mongoose = require("mongoose");
const {Schema} = mongoose;

const certificateSchema = new Schema({
    certificateId: {
        type: String, required: true, unique: true
    },
    student:        { type: mongoose.Schema.Types.ObjectId, ref: "Student",  required: true },
  course:         { type: mongoose.Schema.Types.ObjectId, ref: "Course",   required: true },
  batch:          { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
  template:       { type: mongoose.Schema.Types.ObjectId, ref: "CertificateTemplate" },

  studentName:    { type: String, required: true },
  programName:    { type: String, required: true },
  courseName:     { type: String, required: true },
  completionDate: { type: Date,   default: Date.now },

  qrCodeBase64:   { type: String },
  verifyUrl:      { type: String },

   pdfUrl:         { type: String },

   shareUrl:       { type: String },

  isManuallyIssued: { type: Boolean, default: false },
  issuedBy:         { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }
}, { timestamps: true });


module.exports = mongoose.model("Certificate", certificateSchema);
