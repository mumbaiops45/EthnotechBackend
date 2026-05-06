const express = require("express");
const router = express.Router();
const videoProgrssController = require("../controller/videoProgress.controller");
const {auth} = require("../middlewares/auth.middleware");

router.post("/save",                              auth, videoProgrssController.saveProgress);
router.get("/resume/:lessonId",                   auth, videoProgrssController.getResumePosition);
router.get("/access/:courseId/:lessonId",         auth, videoProgrssController.checkLessonAccess);

module.exports = router;