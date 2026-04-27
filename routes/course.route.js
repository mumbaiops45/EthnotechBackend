const express  = require("express");
const router = express.Router();
const courseController = require("../controller/course.controller");
const {instructorAuth} = require("../middlewares/instructor.middleware");  
// const {superAdminOnly} = require("../middlewares/auth.middleware")
const {auth, protect , superAdminOnly} = require("../middlewares/auth.middleware");

router.post("/", instructorAuth , courseController.createCourse);

router.get("/", instructorAuth  , courseController.getCourse);

router.get("/:id" , instructorAuth , courseController.getCourseById);

router.put("/:id", instructorAuth , courseController.updateCourse);

router.delete("/:id", instructorAuth , courseController.deleteCourse);

router.post("/:id/module" , instructorAuth , courseController.addModule);

router.put("/:id/module/reorder", instructorAuth, courseController.reorderModule);

module.exports = router;

