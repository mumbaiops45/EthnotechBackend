const LiveSession = require("../model/LiveSession.model");
const Batch = require("../model/Batch.model");

exports.getStudentCalendar = async (studentId, { month, year, course, program }) => {
  
  const batches = await Batch.find({ students: studentId });
  const batchIds = batches.map(b => b._id);

  const start = new Date(year, month - 1, 1);
  const end   = new Date(year, month,     0, 23, 59, 59);

  const query = {
    batch:       { $in: batchIds },
    scheduledAt: { $gte: start, $lte: end },
    status:      { $ne: "cancelled" },
  };

  if (course) query.course = course;

  const sessions = await LiveSession.find(query)
    .populate("instructor", "fullName")
    .populate("batch",      "name program")
    .populate("course",     "title")
    .sort({ scheduledAt: 1 });


    return sessions.map(s => ({
    id:          s._id,
    title:       s.title,
    topic:       s.topic,
    instructor:  s.instructor?.fullName,
    batch:       s.batch?.name,
    program:     s.batch?.program,
    course:      s.course?.title,
    scheduledAt: s.scheduledAt,
    duration:    s.duration,
    platform:    s.platform,
    status:      s.status,
    isLinkActive: new Date() >= s.linkActiveAt,
    recordingUrl: s.recordingUrl || null,
  }));
};


exports.getWeeklyCalendar = async (studentId, startDate) => {
  const batches  = await Batch.find({ students: studentId });
  const batchIds = batches.map(b => b._id);

  const start = new Date(startDate);
  const end   = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);

  return LiveSession.find({
    batch:       { $in: batchIds },
    scheduledAt: { $gte: start, $lte: end },
    status:      { $ne: "cancelled" },
  })
  .populate("instructor", "fullName")
    .populate("batch",      "name")
    .populate("course",     "title")
    .sort({ scheduledAt: 1 });
};
