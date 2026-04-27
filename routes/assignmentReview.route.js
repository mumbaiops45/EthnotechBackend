const express = require("express");
const router = express.Router();
const assignmentReviewController = require("../controller/assignmentReview.controller"); 
const {instructorAuth} = require("../middlewares/instructor.middleware");
const {auth} = require("../middlewares/auth.middleware");


router.post("/:assignmentId/submit", auth , assignmentReviewController.submitAssignment);

router.get("/pending",                     instructorAuth, assignmentReviewController.getPendingSubmissions);
router.get("/:id",                         instructorAuth, assignmentReviewController.getSubmissionById);
router.put("/:id/grade",                   instructorAuth, assignmentReviewController.gradeSubmission);
router.patch("/:id/publish",               instructorAuth, assignmentReviewController.publishResult);
router.get("/assignment/:assignmentId",    instructorAuth, assignmentReviewController.getSubmissionsByAssignment);

module.exports = router;