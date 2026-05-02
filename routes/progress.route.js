const express = require("express");
const router = express.Router();

const progressController = require("../controller/progress.controller");
const { instructorAuth } = require("../middlewares/instructor.middleware");
const { auth } = require("../middlewares/auth.middleware");


router.get("/my/:courseId", auth, progressController.getMyProgress);
router.post("/update-lesson", auth, progressController.updateLessonProgress);


router.get("/batch/:batch", instructorAuth, progressController.getBatchProgress);
router.get("/:studentId/:courseId", instructorAuth, progressController.getStudentProgress);

module.exports = router;