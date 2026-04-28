const calendarService = require("../services/calendar.service");

exports.getStudentCalendar = async (req , res) => {
    try {
        const {studentId} = req.params;
        const {month , year, course , program} = req.query;

        if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    const sessions = await calendarService.getStudentCalendar(
      studentId, { month, year, course, program }
    );

     res.status(200).json(sessions);

    } catch (error) {
        console.error("Error fetching student calendar:", error);
    res.status(500).json({ message: error.message });
    }
};


exports.getWeeklyCalendar = async (req, res) => {
    try {
        const {studentId} = req.params;
        const {startDate} = req.query;

        if (!startDate) {
      return res.status(400).json({ message: "Start date is required" });
    }

     const sessions = await calendarService.getWeeklyCalendar(
      studentId, startDate
    );

    res.status(200).json(sessions);

    } catch (error) {
        console.error("Error fetching weekly calendar:", error);
    res.status(500).json({ message: error.message });
    }
}



