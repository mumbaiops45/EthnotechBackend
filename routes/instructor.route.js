const express = require("express");
const router = express.Router();
const instructorController = require("../controller/instructor.controller");
const {instructorAuth} = require("../middlewares/instructor.middleware");


router.post("/login", instructorController.login);
router.get("/profile", instructorAuth, instructorController.getProfile);
router.put("/profile/update", instructorAuth, instructorController.updateProfile);



router.get("/my-courses",       instructorAuth, instructorController.getMyCourses);
router.get("/my-batches",       instructorAuth, instructorController.getMyBatches);
router.get("/my-students",      instructorAuth, instructorController.getMyStudents);
router.get("/my-dashboard",     instructorAuth, instructorController.getMyDashboard);
router.get("/my-courses/:courseId/students", instructorAuth, instructorController.getCourseStudents);

module.exports = router;