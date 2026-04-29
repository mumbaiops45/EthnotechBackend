const express = require("express");
const router = express.Router();
const descriptiveController =require("../controller/descriptive.controller");
const {auth }= require("../middlewares/auth.middleware");
const {instructorAuth} = require("../middlewares/instructor.middleware");


router.post("/:assessmentId/submit",  auth, descriptiveController.submitDesciptive);
router.get("/my-history",             auth, descriptiveController.getStudentHistory);


router.get("/pending",                instructorAuth, descriptiveController.getPendingSubmissions);
router.get("/:id",                    instructorAuth, descriptiveController.getSubmissionById);
router.put("/:id/grade",              instructorAuth, descriptiveController.gradeSubmission);
router.patch("/:id/publish",          instructorAuth, descriptiveController.publishResult);

module.exports = router;