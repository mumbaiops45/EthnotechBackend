const express = require("express");
const router = express.Router();
const attendanceController = require("../controller/attendance.controller");
const {instructorAuth} = require("../middlewares/instructor.middleware");
const {protect} = require("../middlewares/auth.middleware");



router.post("/:sessionId/init",         instructorAuth, attendanceController.initAttendance);
router.get("/:sessionId",               instructorAuth, attendanceController.getSessionAttendance);
router.put("/:sessionId/mark",          instructorAuth, attendanceController.markAttendance);
router.put("/:sessionId/bulk",          instructorAuth, attendanceController.bulkMarkAttendance);
router.get("/report/:studentId/:batchId", protect, attendanceController.getStudentAttendanceReport);

module.exports = router;