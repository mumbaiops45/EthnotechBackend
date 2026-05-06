const express = require("express");
const router = express.Router();
const dashboardController = require("../controller/dashboard.controller");
const {auth} = require("../middlewares/auth.middleware");


router.get("/",                          auth, dashboardController.getDashboard);
router.get("/programs",                  auth, dashboardController.getMyPrograms);
router.get("/courses",                   auth, dashboardController.getMyCourses);
router.get("/courses/:courseId",         auth, dashboardController.getCourseDetail);
router.get("/courses/:courseId/completion", auth, dashboardController.getCourseCompletion);

module.exports = router;