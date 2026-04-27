const express = require("express");
const router = express.Router();
const announcementController = require("../controller/announcement.controller");
const {instructorAuth} = require("../middlewares/instructor.middleware");


router.post("/",    instructorAuth, announcementController.sendAnnouncement);
router.get("/",     instructorAuth, announcementController.getAnnouncements);
router.get("/:id",  instructorAuth, announcementController.getAnnouncementById);

module.exports = router;