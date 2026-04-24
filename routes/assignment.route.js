const express = require("express");
const router = express.Router();
const assignmentController = require("../controller/assignment.controller");
const {instructorAuth} = require("../middlewares/instructor.middleware");


router.post("/", instructorAuth , assignmentController.createAssignment);
router.get("/", instructorAuth , assignmentController.getAssignments);
router.put("/:id", instructorAuth , assignmentController.updateAssignment);
router.delete("/:id", instructorAuth , assignmentController.deleteAssignment);


module.exports = router;