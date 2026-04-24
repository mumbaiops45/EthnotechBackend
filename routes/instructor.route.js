const express = require("express");
const router = express.Router();
const instructorController = require("../controller/instructor.controller");
const {instructorAuth} = require("../middlewares/instructor.middleware");


router.post("/login", instructorController.login);
router.get("/profile", instructorAuth, instructorController.getProfile);
router.put("/profile/update", instructorAuth, instructorController.updateProfile);

module.exports = router;