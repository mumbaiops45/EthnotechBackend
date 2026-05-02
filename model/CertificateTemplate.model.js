
const mongoose = require("mongoose");
const {Schema} = mongoose;

const templateSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    institutionName : {
        type: String,
        default: "NNC Mumbai"
    },
    logoUrl: {
        type: String
    },
    signatoryName: {
        type: String,
        required: true
    },
    signatureImageUrl: {
        type: String
    },
    program: {
        type: String
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
}, {timestamps: true});


module.exports = mongoose.model("CertificateTemplate", templateSchema);
