const LiveSession = require("../model/LiveSession.model");
const Batch = require("../model/Batch.model");
const {notifyStudents } = require("../utils/notification");


exports.scheduleSession = async (instructorId ,data) => {
    const session = await LiveSession.create({
        ...data,
        instructor: instructorId,
    });


    const batch = await Batch.findById(data.batch)
    .populate("students", "fullName Email Mobile");

    if(batch && batch.students.length > 0) {
        const subject = `New Live Class Scheduled: ${session.title} `;
        const message = `Your instructor has scheduled a live class "${session.title}" on ${new Date(session.date).toLocaleString()} for ${session.duration} minutes.`;
        await notifyStudents(batch.students , subject, message);

        session.notifiedStudents = batch.students.map(s => s._id);
        await session.save();
    }

    return session;
};

exports.getSessions = async (instructorId) => {
    return LiveSession.find({ instructor: instructorId})
    .populate("batch", "name branch")
    .populate("course", "title")
    .sort({date: 1});
};


exports.getSessionById = async (sessionId) => {
    const session = await LiveSession.findById(sessionId)
    .populate("batch", "name branch")
    .populate("course", "title")
    .populate("instructor", "fullName email");
    if(!session) throw new Error("Session not found");

    return session;
};


exports.updateSession = async (sessionId , instructorId, data) => {
    const session = await LiveSession.findOneAndUpdate(
        {_id: sessionId, instructor: instructorId},
        {$set: data},
        {new: true}
    );

    if(!session) throw new Error("Session not found");

    const batch = await Batch.findById(session.batch)
    .populate("students", "fullName email mobile");

    if(batch?.students?.length > 0){
        const subject = `Live Class Updated: ${session.title}`;
        const message = `The live class "${session.title}" has been updated. New time: ${new Date(session.date).toLocaleString()}`;
        await notifyStudents(batch.students , subject , message);
    }

    return session;
};


exports.cancelSession = async (sessionId, instructorId) => {
    const session = await LiveSession.findOneAndUpdate(
        {_id: sessionId, instructor: instructorId},
        {$set: {status: "cancelled"}},
        {new : true}
    );
    if(!session) throw new Error("Session not found");

    const batch = await Batch.findById(session.batch)
    .populate("students", "fullName email mobile");

    if(batch?.students?.length > 0){
        const subject = `Live Class Cancelled: ${session.title}`;
        const message = `The live class "${session.title}" scheduled for ${new Date(session.date).toLocaleString()} has been cancelled.`;
    await notifyStudents(batch.students, subject, message);
    }

    return { message: "Session cancelled and students notified" };

}



exports.getCalendar = async (instructorId, month, year) => {
  const start = new Date(year, month - 1, 1);
  const end   = new Date(year, month, 0, 23, 59, 59);

  return LiveSession.find({
    instructor: instructorId,
    date: { $gte: start, $lte: end },
  }).populate("batch", "name").sort({ date: 1 });
};

