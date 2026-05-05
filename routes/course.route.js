const express  = require("express");
const router = express.Router();
const Course = require("../model/Course.model");
const courseController = require("../controller/course.controller");
const {instructorAuth} = require("../middlewares/instructor.middleware");  
const {auth, protect , adminOrAbove , superAdminOnly} = require("../middlewares/auth.middleware");

router.post("/", instructorAuth , courseController.createCourse);

router.get("/", instructorAuth  , courseController.getCourse);
router.get("/admin/all", protect, adminOrAbove, async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate("instructor", "fullName email")
      .populate("modules.lessons", "title")
      .sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/:id" , instructorAuth , courseController.getCourseById);

router.put("/:id", instructorAuth , courseController.updateCourse);

router.delete("/:id", instructorAuth , courseController.deleteCourse);

router.post("/:id/module" , instructorAuth , courseController.addModule);

router.put("/:id/module/reorder", instructorAuth, courseController.reorderModule);

module.exports = router;

