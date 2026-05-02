const express = require("express");
const router = express.Router();
const certificateController = require("../controller/certificate.controller");
const { auth , protect , adminOrAbove} = require("../middlewares/auth.middleware");

router.get("/my" , auth , certificateController.getStudentCertificates);
router.get("/download/:certificateId",  auth, certificateController.downloadCertificate);


// Admin routes
router.post("/trigger",     protect, adminOrAbove, certificateController.triggerAutoGeneration);
router.post("/manual",      protect, adminOrAbove, certificateController.manualGenerate);
router.get("/all",          protect, adminOrAbove, certificateController.getAllCertificates);
router.get("/logs",         protect, adminOrAbove, certificateController.getDownloadLogs);

module.exports = router;


