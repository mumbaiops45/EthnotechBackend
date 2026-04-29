const express = require("express");
const router = express.Router();
const attemptController = require("../controller/attempt.controller");
const {auth } = require("../middlewares/auth.middleware");

router.post("/:assessmentId/begin",       auth, attemptController.startAttempt);
router.post("/:attemptId/submit",         auth, attemptController.submitAttempt);
router.get("/:assessmentId/history",      auth, attemptController.getAttemptHistory);

module.exports = router;