const express = require("express");
const router = express.Router();
const liveSessionController = require("../controller/liveSession.controller");
const {instructorAuth} = require("../middlewares/instructor.middleware");


router.post("/",              instructorAuth, liveSessionController.scheduleSession);
router.get("/",               instructorAuth, liveSessionController.getSessions);
router.get("/calendar",       instructorAuth, liveSessionController.getCalendar);
router.get("/:id",            instructorAuth, liveSessionController.getSessionById);
router.put("/:id",            instructorAuth, liveSessionController.updateSession);
router.patch("/:id/cancel",   instructorAuth, liveSessionController.cancelSession);

module.exports = router;