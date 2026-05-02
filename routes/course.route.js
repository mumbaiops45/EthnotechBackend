const express  = require("express");
const router = express.Router();
const courseController = require("../controller/course.controller");
const {instructorAuth} = require("../middlewares/instructor.middleware");  
const {auth, protect , superAdminOnly} = require("../middlewares/auth.middleware");

router.post("/", instructorAuth , courseController.createCourse);

router.get("/", instructorAuth  , courseController.getCourse);

router.get("/:id" , instructorAuth , courseController.getCourseById);

router.put("/:id", instructorAuth , courseController.updateCourse);

router.delete("/:id", instructorAuth , courseController.deleteCourse);

router.post("/:id/module" , instructorAuth , courseController.addModule);

router.put("/:id/module/reorder", instructorAuth, courseController.reorderModule);

module.exports = router;

// const express  = require("express");
// const router = express.Router();

// const courseController = require("../controller/course.controller");

// const { instructorAuth } = require("../middlewares/instructor.middleware");
// const { protect } = require("../middlewares/auth.middleware");
// const { allowRoles } = require("../middlewares/auth.middleware");

// // 🔴 CREATE COURSE
// router.post(
//   "/",
//   protect,
//   allowRoles("SuperAdmin", "Instructor"),
//   courseController.createCourse
// );

// // 🔴 GET ALL COURSES
// router.get(
//   "/",
//   protect,
//   allowRoles("SuperAdmin", "Instructor"),
//   courseController.getCourse
// );

// // 🔴 GET COURSE BY ID
// router.get(
//   "/:id",
//   protect,
//   allowRoles("SuperAdmin", "Instructor"),
//   courseController.getCourseById
// );

// // 🔴 UPDATE COURSE
// router.put(
//   "/:id",
//   protect,
//   allowRoles("SuperAdmin", "Instructor"),
//   courseController.updateCourse
// );

// // 🔴 DELETE COURSE (ONLY SUPER ADMIN)
// router.delete(
//   "/:id",
//   protect,
//   allowRoles("SuperAdmin"),
//   courseController.deleteCourse
// );

// // 🔴 MODULE MANAGEMENT
// router.post(
//   "/:id/module",
//   protect,
//   allowRoles("SuperAdmin", "Instructor"),
//   courseController.addModule
// );

// router.put(
//   "/:id/module/reorder",
//   protect,
//   allowRoles("SuperAdmin", "Instructor"),
//   courseController.reorderModule
// );

// module.exports = router;