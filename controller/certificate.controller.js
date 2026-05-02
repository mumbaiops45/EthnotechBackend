const certificateService = require("../services/certificate.service");

exports.triggerAutoGeneration = async (req , res) => {
    try {
        const {studentId , courseId} = req.body;
        const result = await certificateService.triggerAutoGeneration(studentId ,courseId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


exports.manualGenerate = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    const certificate = await certificateService.manualGenerate(
      studentId, courseId, req.admin._id
    );
    res.status(201).json({ message: "Certificate issued manually", certificate });
  } catch (err) { res.status(400).json({ message: err.message }); }
};



exports.downloadCertificate = async (req, res) => {
  try {
    const certificate = await certificateService.downloadCertificate(
      req.params.certificateId,
      req.user.id,
      req.ip,
      req.headers["user-agent"]
    );

    
    const path = require("path");
    const filePath = path.join(__dirname, "../", certificate.pdfUrl);
    res.download(filePath, `${certificate.certificateId}.pdf`);
  } catch (err) { res.status(404).json({ message: err.message }); }
};


exports.verifyCertificate = async (req, res) => {
  try {
    const result = await certificateService.verifyCertificate(req.params.certificateId);
    res.status(200).json(result);
  } catch (err) { res.status(404).json({ message: err.message }); }
};


exports.getStudentCertificates = async (req, res) => {
  try {
    const certificates = await certificateService.getStudentCertificates(req.user.id);
    res.status(200).json(certificates);
  } catch (err) { res.status(400).json({ message: err.message }); }
};


exports.getAllCertificates = async (req, res) => {
  try {
    const certificates = await certificateService.getAllCertificates(req.query);
    res.status(200).json(certificates);
  } catch (err) { res.status(400).json({ message: err.message }); }
};


exports.getDownloadLogs = async (req, res) => {
  try {
    const logs = await certificateService.getDownloadLogs(req.query);
    res.status(200).json(logs);
  } catch (err) { res.status(400).json({ message: err.message }); }
};