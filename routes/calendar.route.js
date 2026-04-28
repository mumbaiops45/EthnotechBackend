const express = require("express");
const router = express.Router();
const calendarController = require("../controller/calendar.controller");
const {auth} = require("../middlewares/auth.middleware");



// GET http://localhost:8080/calendar/monthly?month=6&year=2024
// GET http://localhost:8080/calendar/monthly?month=6&year=2024&course=course_id
// GET http://localhost:8080/calendar/weekly?startDate=2024-06-10

router.get("/monthly" , auth , calendarController.getStudentCalendar);

router.get("/weekly", auth , calendarController.getWeeklyCalendar);

module.exports = router;