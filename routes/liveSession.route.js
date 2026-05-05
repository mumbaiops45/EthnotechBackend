const express = require("express");
const router = express.Router();
const liveSessionController = require("../controller/liveSession.controller");
const {instructorAuth} = require("../middlewares/instructor.middleware");
const {auth} = require("../middlewares/auth.middleware");


router.post("/",                  instructorAuth, liveSessionController.scheduleSession);
router.get("/",                   instructorAuth, liveSessionController.getSessions);
router.get("/:id",                instructorAuth, liveSessionController.getSessionById);
router.put("/:id",                instructorAuth, liveSessionController.updateSession);
router.patch("/:id/cancel",       instructorAuth, liveSessionController.cancelSession);
router.delete("/:id", instructorAuth , liveSessionController.deleteSession);
router.patch("/:id/recording",    instructorAuth, liveSessionController.uploadRecording);

router.get("/:id/join",           auth, liveSessionController.getJoinStatus);

module.exports = router;



