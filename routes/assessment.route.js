const express = require("express");
const router = express.Router();
const assessmentController = require("../controller/assessment.controller");
const {instructorAuth} = require("../middlewares/instructor.middleware");
const {auth} = require("../middlewares/auth.middleware");



router.post("/",                    instructorAuth, assessmentController.createAssessment);
router.get("/",                     instructorAuth, assessmentController.getAssessments);
router.get("/:id",                  instructorAuth, assessmentController.getAssessmentsById);
router.put("/:id",                  instructorAuth, assessmentController.updateAssessment);
router.delete("/:id",               instructorAuth, assessmentController.deleteAssessment);
router.patch("/:id/publish",        instructorAuth, assessmentController.publishAssessment);
router.get("/:id/attempts",         instructorAuth, assessmentController.getAllAttemptsForInstructor);


router.get("/:id/start",            auth, assessmentController.getAssessmentForStudent);

module.exports = router;