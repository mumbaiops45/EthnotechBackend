// const express  = require("express");
// const router = express.Router();
// const courseController = require("../controller/course.controller");
// const {instructorAuth} = require("../middlewares/instructor.middleware");  
// const {auth, protect , superAdminOnly} = require("../middlewares/auth.middleware");

// router.post("/", instructorAuth , protect , superAdminOnly , courseController.createCourse);

// router.get("/", instructorAuth , protect , superAdminOnly , courseController.getCourse);

// router.get("/:id" , instructorAuth, protect , superAdminOnly , courseController.getCourseById);

// router.put("/:id", instructorAuth , protect , superAdminOnly , courseController.updateCourse);

// router.delete("/:id", instructorAuth , protect , superAdminOnly, courseController.deleteCourse);

// router.post("/:id/module" , instructorAuth, protect , superAdminOnly , courseController.addModule);

// router.put("/:id/module/reorder", instructorAuth, protect , superAdminOnly, courseController.reorderModule);

// module.exports = router;

const express  = require("express");
const router = express.Router();
const courseController = require("../controller/course.controller");
const {instructorAuth} = require("../middlewares/instructor.middleware");  
const {auth, protect , superAdminOnly} = require("../middlewares/auth.middleware");

// Routes for instructors
router.post("/", instructorAuth , protect , superAdminOnly , courseController.createCourse);  // For creating course (SuperAdmin only)
router.get("/", instructorAuth , protect , courseController.getCourse);  // For viewing courses (Instructors can view)
router.get("/:id" , instructorAuth , protect , courseController.getCourseById); // For viewing a specific course (Instructors can view)
router.put("/:id", instructorAuth , protect , superAdminOnly , courseController.updateCourse); // For updating courses (SuperAdmin only)
router.delete("/:id", instructorAuth , protect , superAdminOnly, courseController.deleteCourse); // For deleting courses (SuperAdmin only)

// Routes for modules in a course
router.post("/:id/module" , instructorAuth, protect , superAdminOnly , courseController.addModule);  // For adding modules (SuperAdmin only)
router.put("/:id/module/reorder", instructorAuth, protect , superAdminOnly, courseController.reorderModule);  // For reordering modules (SuperAdmin only)

module.exports = router;