const mongoose = require("mongoose");
const {Schema} = mongoose;

const downloadLogSchema = new Schema({
  
    certificate : {
        type: mongoose.Schema.Types.ObjectId, ref: "Certificate", required: true
    },
    
 student:     { type: mongoose.Schema.Types.ObjectId, ref: "Student",     required: true },
  downloadedAt:{ type: Date, default: Date.now },
  ipAddress:   { type: String },
  userAgent:   { type: String },

} , {timestamps: true});


module.exports = mongoose.model("CertificationDownloadLog", downloadLogSchema);