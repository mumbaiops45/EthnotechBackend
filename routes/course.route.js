const express  = require("express");
const router = express.Router();
const courseController = require("../controller/course.controller");
const {instructorAuth} = require("../middlewares/instructor.middleware");  
const {auth, protect , superAdminOnly} = require("../middlewares/auth.middleware");

router.post("/", instructorAuth , protect , superAdminOnly , courseController.createCourse);

router.get("/", instructorAuth , protect , superAdminOnly , courseController.getCourse);

router.get("/:id" , instructorAuth, protect , superAdminOnly , courseController.getCourseById);

router.put("/:id", instructorAuth , protect , superAdminOnly , courseController.updateCourse);

router.delete("/:id", instructorAuth , protect , superAdminOnly, courseController.deleteCourse);

router.post("/:id/module" , instructorAuth, protect , superAdminOnly , courseController.addModule);

router.put("/:id/module/reorder", instructorAuth, protect , superAdminOnly, courseController.reorderModule);

module.exports = router;

