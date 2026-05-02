const CertificateTemplate = require("../model/CertificateTemplate.model");

exports.createTemplate = async (req, res) => {
    try {
        const template = await CertificateTemplate.create({
            ...req.body,
            createdBy: req.admin._id
        });
        res.status(201).json({message: "Template created", template});
    } catch (error) {
        
        res.status(400).json({message: error.message});
    }
};


exports.getTemplates = async (req , res) => {
    try {
        const templates = await CertificateTemplate.findByIdAndUpdate(
            req.params.id , { $set: req.body}, { new: true}
        );
        res.status(200).json({message: "Template Updated", template});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


exports.updateTemplate = async (req, res) => {
    try {
        const template = await CertificateTemplate.findByIdAndUpdate(req.params.id , {$set: req.body} , {new: true});

        res.status(200).json({message: "Template updated", template});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}


exports.deleteTemplate = async (req, res) => {
  try {
    await CertificateTemplate.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Template deleted" });
  } catch (err) { res.status(400).json({ message: err.message }); }
};