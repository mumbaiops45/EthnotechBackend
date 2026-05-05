const LiveSession = require("../model/LiveSession.model");
const Batch = require("../model/Batch.model");
const Attendance = require("../model/Attendance.model");
const { notifyStudents } = require("../utils/notification");



exports.scheduleSession = async (instructorId, data) => {

    const linkActiveAt = new Date(
        new Date(data.scheduledAt).getTime() - 10 * 60 * 1000
    );
    const session = await LiveSession.create({
        ...data,
        instructor: instructorId,
        linkActiveAt,
    });


    const batch = await Batch.findById(data.batch)
        .populate("students", "fullName Email Mobile");

    if (batch?.students?.length > 0) {
        const title = `📅 New Live Class Scheduled: ${session.title}`;
        const message = `A new live class "${session.topic}" has been scheduled on ${new Date(session.scheduledAt).toLocaleString()}. Duration: ${session.duration} mins.`;
        await notifyStudents(batch.students, title, message, "live_class", session._id);

        session.notifiedStudents = batch.students.map(s => s._id);
        await session.save();
    }

    return session;
};

exports.getJoinStatus = async (sessionId, studentId) => {
    const session = await LiveSession.findById(sessionId)
        .populate("instructor", "fullName")
        .populate("batch", "name");

    if (!session) throw new Error("Session not found");


    const now = new Date();
    const isActive = now >= session.linkActiveAt;
    const isCompleted = session.status === "completed";
    const isCancelled = session.status === "cancelled";

    let countdownSeconds = 0;
    if (!isActive) {
        countdownSeconds = Math.floor((session.linkActiveAt - now) / 1000);
    }

    if (isActive && !isCompleted && !isCancelled) {
        await Attendance.findOneAndUpdate(
            { session: sessionId, student: studentId },
            {
                $set: {
                    status: "present",
                    joinedAt: now,
                    autoMarked: true,
                    batch: session.batch,
                }
            },
            { upsert: true, new: true }
        );
    }

    return {
        sessionId: session._id,
        title: session.title,
        topic: session.topic,
        instructor: session.instructor?.fullName,
        scheduledAt: session.scheduledAt,
        duration: session.duration,
        platform: session.platform,
        status: session.status,
        isLinkActive: isActive && !isCompleted && !isCancelled,
        joinLink: isActive ? session.joinLink : null,
        countdownSeconds: isActive ? 0 : countdownSeconds,
        message: isCancelled ? "This session has been cancelled" :
            isCompleted ? "This session has ended" :
                isActive ? "Link is active — join now!" :
                    `Link activates in ${Math.ceil(countdownSeconds / 60)} minutes`,
    };
};

exports.getSessions = async (instructorId) => {
    return LiveSession.find({ instructor: instructorId })
        .populate("batch", "name branch")
        .populate("course", "title")
        .sort({ scheduledAt: 1 });
};


exports.getSessionById = async (sessionId) => {
    const session = await LiveSession.findById(sessionId)
        .populate("batch", "name branch")
        .populate("course", "title")
        .populate("instructor", "fullName email");
    if (!session) throw new Error("Session not found");

    return session;
};


exports.updateSession = async (sessionId, instructorId, data) => {

    if (data.scheduledAt) {
        data.linkActiveAt = new Date(
            new Date(data.scheduledAt).getTime() - 10 * 60 * 1000
        );
    }

    const session = await LiveSession.findOneAndUpdate(
        { _id: sessionId, instructor: instructorId },
        { $set: data },
        { new: true }
    );

    if (!session) throw new Error("Session not found");

    const batch = await Batch.findById(session.batch)
        .populate("students", "fullName email mobile");

    if (batch?.students?.length > 0) {
        const subject = `Live Class Updated: ${session.title}`;
        const message = `The live class "${session.title}" has been updated. New time: ${new Date(session.date).toLocaleString()}`;
        await notifyStudents(batch.students, subject, message);
    }

    return session;
};


exports.cancelSession = async (sessionId, instructorId) => {
    const session = await LiveSession.findOneAndUpdate(
        { _id: sessionId, instructor: instructorId },
        { $set: { status: "cancelled" } },
        { new: true }
    );
    if (!session) throw new Error("Session not found");

    const batch = await Batch.findById(session.batch)
        .populate("students", "fullName email mobile");

    if (batch?.students?.length > 0) {
        const title = `Live Class Cancelled: ${session.title}`;
        const message = `The class "${session.topic}" on ${new Date(session.scheduledAt).toLocaleString()} has been cancelled.`;
        await notifyStudents(batch.students, title, message, "live_class", session._id);
    }

    return { message: "Session cancelled and students notified" };

}


exports.uploadRecording = async (sessionId, recordingUrl) => {
    const session = await LiveSession.findByIdAndUpdate(
        sessionId,
        {
            $set: {
                recordingUrl,
                recordingUploadedAt: new Date(),
                status: "completed",
            }
        },
        { new: true }
    );
    if (!session) throw new Error("Session not found");
    const batch = await Batch.findById(session.batch)
        .populate("students", "fullName email mobile");
    if (batch?.students?.length > 0) {
        const title = `🎬 Recording Available: ${session.title}`;
        const message = `The recording for "${session.topic}" is now available. Watch the replay anytime from your course portal.`;
        await notifyStudents(batch.students, title, message, "live_class", session._id);
    }

    return session;
};

exports.deleteSession = async (sessionId , instructorId) => {
    const session = await LiveSession.findOneAndDelete({
        _id: sessionId,
        instructor: instructorId
    });

    if (!session) {
        throw new Error("Session not found or not authorized to delete");
    }

    const batch = await Batch.findById(session.batch)
    .populate("students", "fillName email mobile");

    if(batch?.students?.length > 0){
        const title = `Live Class Deleted: ${session.title}`;
        const message = `The live session "${session.topic}" scheduled on ${new Date(session.scheduledAt).toLocaleString()} has been removed.`;

         await notifyStudents(batch.students, title, message, "live_class", session._id);
    }
      return { message: "Session deleted successfully" };
}

exports.getCalendar = async (instructorId, month, year) => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    return LiveSession.find({
        instructor: instructorId,
        date: { $gte: start, $lte: end },
    }).populate("batch", "name").sort({ date: 1 });
};







