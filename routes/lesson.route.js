const express = require("express");
const router = express.Router();
const lessonController = require("../controller/lesson.controller");
const { instructorAuth } = require("../middlewares/instructor.middleware");

router.get(
    "/course/:courseId/lessons", lessonController.getLessonsByModule);

router.get("/lesson/:lessonId", lessonController.getLessonById);
router.post("/:courseId/module/:moduleId/lesson", instructorAuth, lessonController.createLesson);
router.put("/lesson/:lessonId", instructorAuth, lessonController.updateLesson);
router.delete("/lesson/:lessonId", instructorAuth, lessonController.deleteLesson);
router.put("/:courseId/module/:moduleId/lesson/reorder", instructorAuth, lessonController.reorderLessons);

module.exports = router;