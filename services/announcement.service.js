const Announcement = require("../model/Announcement.model");
const Batch = require("../model/Batch.model");
const Student = require("../model/student.model");
const {sendEmail , sendSMS, sendInApp} = require("../utils/notification");


exports.sendAnnouncement = async (instructorId , data) => {
    const {title , message, targetType , batch , course, channels} = data;

    let students = [];

    if(targetType === "batch"){
        const batchDoc = await Batch.findById(batch)
        .populate("students", "fullName email mobile");
        if(!batchDoc) throw new Error("Batch not found");
        students = batchDoc.students;
    } else if (targetType === "course"){
        const batches = await Batch.find({courses: course})
        .populate("students" , "fullName email mobile");
        students = batches.flatMap(b => b.students);

        students = [...new Map(students.map(s => [s._id.toString(), s])).values()];
    } else if (targetType === "all"){
        students = await Student.find({isVerified: true}).select("fullName email mobile");
    }

    if(students.length === 0) throw new Error("No students found for this target");


    for (const student of students) {
    if (channels?.inApp !== false) {
      await sendInApp(student._id, ` ${title}: ${message}`);
    }
    if (channels?.email !== false && student.email) {
      await sendEmail(student.email, title, message);
    }
    if (channels?.sms === true && student.mobile) {
      await sendSMS(student.mobile, `${title}: ${message}`);
    }
  }

  const announcement = await Announcement.create({
    title,
    message,
    instructor: instructorId,
    targetType,
    batch,
    course,
    channels,
    sentTo: students.map(s => s._id),
  });

  return {
    message: `Announcement sent to ${students.length} students`,
    announcement,
  };
}



exports.getAnnouncements = async (instructorId) => {
  return Announcement.find({ instructor: instructorId })
    .populate("batch",  "name branch")
    .populate("course", "title")
    .sort({ createdAt: -1 });
};



exports.getAnnouncementById = async (id) => {
  const announcement = await Announcement.findById(id)
    .populate("sentTo", "fullName email mobile")
    .populate("batch",  "name")
    .populate("course", "title");
  if (!announcement) throw new Error("Announcement not found");
  return announcement;
};