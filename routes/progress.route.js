const express = require("express");
const router = express.Router();
const progressController = require("../controller/progress.controller");
const {instructorAuth} = require("../middlewares/instructor.middleware");

router.get("/batch/:batch",         instructorAuth, progressController.getBatchProgress);
router.get("/:studentId/:courseId", instructorAuth, progressController.getStudentProgress);

module.exports = router;