const Attendance = require("../model/Attendance.model");
const LiveSession = require("../model/LiveSession.model");
const Batch = require("../model/Batch.model");

exports.initAttendance = async (sessionId) => {
    const session = await LiveSession.findById(sessionId).populate("batch");
    if(!session) throw new Error("Session not found");


    const batch = await Batch.findById(session.batch);
    if(!batch) throw new Error("Batch not found");

    const records = batch.students.map(studentId => ({
        session: sessionId,
        student: studentId,
        batch: batch._id,
        status: "absent",
        autoMarked: false,
    }));
    await Attendance.insertMany(records, { ordered: false }).catch(() => {});
  return { message: `Attendance initialized for ${records.length} students` };
};

exports.getSessionAttendance = async (sessionId) => {
  return Attendance.find({ session: sessionId })
    .populate("student", "fullName email mobile")
    .sort({ "student.fullName": 1 });
};

exports.markAttendance = async (sessionId, studentId, status, instructorId, note) => {
  const attendance = await Attendance.findOneAndUpdate(
    { session: sessionId, student: studentId },
    {
      $set: {
        status,
        autoMarked: false,
        markedBy:   instructorId,
        note,
      }
    },
    { upsert: true, new: true }
  );
  return attendance;
};


exports.bulkMarkAttendance = async (sessionId, records, instructorId) => {
  const updates = records.map(({ studentId, status, note }) => ({
    updateOne: {
      filter: { session: sessionId, student: studentId },
      update: {
        $set: {
          status,
          autoMarked: false,
          markedBy:   instructorId,
          note,
          batch: records.batch,
        }
      },
      upsert: true,
    }
  }));


  await Attendance.bulkWrite(updates);
  return { message: "Attendance updated successfully" };
};


exports.getStudentAttendanceReport = async (studentId, batchId) => {
  const records = await Attendance.find({ student: studentId, batch: batchId })
    .populate("session", "title topic scheduledAt duration");

  const total    = records.length;
  const present  = records.filter(r => r.status === "present").length;
  const absent   = records.filter(r => r.status === "absent").length;
  const late     = records.filter(r => r.status === "late").length;
  const percent  = total > 0 ? Math.round((present / total) * 100) : 0;

  return {
    studentId,
    batchId,
    total,
    present,
    absent,
    late,
    attendancePercent: percent,
    records,
  };
};