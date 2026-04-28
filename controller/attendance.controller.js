const attendanceService = require("../services/attendance.service");


exports.initAttendance = async (req, res) => {
  try {
    const result = await attendanceService.initAttendance(req.params.sessionId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getSessionAttendance = async (req, res) => {
  try {
    const records = await attendanceService.getSessionAttendance(req.params.sessionId);
    res.status(200).json(records);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { studentId, status, note } = req.body;
    const record = await attendanceService.markAttendance(
      req.params.sessionId, studentId, status, req.instructor._id, note
    );
    res.status(200).json({ message: "Attendance marked", record });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.bulkMarkAttendance = async (req, res) => {
  try {
    const result = await attendanceService.bulkMarkAttendance(
      req.params.sessionId, req.body.records, req.instructor._id
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getStudentAttendanceReport = async (req, res) => {
  try {
    const report = await attendanceService.getStudentAttendanceReport(
      req.params.studentId, req.params.batchId
    );
    res.status(200).json(report);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
