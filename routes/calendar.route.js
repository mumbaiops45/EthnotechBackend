const express = require("express");
const router = express.Router();
const calendarController = require("../controller/calendar.controller");
const {auth} = require("../middlewares/auth.middleware");

router.get("/monthly" , auth , calendarController.getStudentCalendar);

router.get("/weekly", auth , calendarController.getWeeklyCalendar);

module.exports = router;