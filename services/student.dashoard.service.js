const Student = require("../model/student.model");
const Batch = require("../model/Batch.model");
const Progress = require("../model/Progress.model");
const LiveSession = require("../model/LiveSession.model");
const Assessment = require("../model/Assessment.model");
const Announcement = require("../model/Announcement.model");
const Notification = require("../model/Notification.model");
const AssessmentAttempt = require("../model/AssessmentAttempt.model");
const DescriptiveSubmission = require("../model/DescriptiveSubmission.model");



exports.getDashboard = async (studentId) => {
  const student = await Student.findById(studentId).select("-password -otp");
  if (!student) throw new Error("Student not found");

  const batches  = await Batch.find({ students: studentId })
    .populate("courses", "title category program coverImage");

  const courseIds = batches.flatMap(b => b.courses.map(c => c._id));
  const batchIds  = batches.map(b => b._id);

 
  const progressRecords = await Progress.find({
    student: studentId,
    course:  { $in: courseIds }
  }).populate("course", "title category coverImage program");

  const enrolledCourses = progressRecords.map(p => ({
    courseId:          p.course?._id,
    title:             p.course?.title,
    category:          p.course?.category,
    coverImage:        p.course?.coverImage,
    overallCompletion: p.overallCompletion,
    completedLessons:  p.lessons.filter(l => l.isCompleted).length,
    totalLessons:      p.lessons.length,
    attendancePercent: p.attendancePercent,
  }));

  
  const upcomingClasses = await LiveSession.find({
    batch:       { $in: batchIds },
    status:      "scheduled",
    scheduledAt: { $gte: new Date() },
  })
    .populate("instructor", "fullName")
    .populate("course",     "title")
    .sort({ scheduledAt: 1 })
    .limit(5);

 
  const allAssessments = await Assessment.find({
    batch:       { $in: batchIds },
    isPublished: true,
    deadline:    { $gte: new Date() },
  }).select("title type deadline totalMarks batch");

  
  const pendingAssignments = [];
  for (const assessment of allAssessments) {
    if (assessment.type === "mcq") {
      const attempted = await AssessmentAttempt.findOne({
        student: studentId, assessment: assessment._id
      });
      if (!attempted) pendingAssignments.push(assessment);
    } else {
      const submitted = await DescriptiveSubmission.findOne({
        student: studentId, assessment: assessment._id
      });
      if (!submitted) pendingAssignments.push(assessment);
    }
  }


  const recentActivity = await Progress.find({ student: studentId })
    .populate("course", "title")
    .sort({ updatedAt: -1 })
    .limit(5);


  const announcements = await Announcement.find({
    $or: [
      { targetType: "batch",  batch:  { $in: batchIds } },
      { targetType: "all" },
    ]
  })
    .populate("instructor", "fullName")
    .sort({ createdAt: -1 })
    .limit(5);


  const unreadCount = await Notification.countDocuments({
    student: studentId, isRead: false
  });


  const fields        = ["fullName", "mobile", "email"];
  const profileFields = ["photo", "dob", "gender", "education", "program", "branch"];
  let filled          = fields.filter(f => student[f]).length;
  profileFields.forEach(f => { if (student.profile?.[f]) filled++; });
  const completenessPercent = Math.round((filled / (fields.length + profileFields.length)) * 100);

  return {
    student: {
      id:        student._id,
      fullName:  student.fullName || student.profile?.fullName,
      email:     student.email,
      mobile:    student.mobile,
      photo:     student.profile?.photo,
      completenessPercent,
    },
    stats: {
      totalEnrolledCourses: enrolledCourses.length,
      pendingAssignments:   pendingAssignments.length,
      upcomingClasses:      upcomingClasses.length,
      unreadNotifications:  unreadCount,
    },
    enrolledCourses,
    upcomingClasses: upcomingClasses.map(s => ({
      id:          s._id,
      title:       s.title,
      topic:       s.topic,
      instructor:  s.instructor?.fullName,
      course:      s.course?.title,
      scheduledAt: s.scheduledAt,
      duration:    s.duration,
      platform:    s.platform,
      isLinkActive: new Date() >= new Date(s.scheduledAt) - 10 * 60 * 1000,
    })),
    pendingAssignments: pendingAssignments.map(a => ({
      id:         a._id,
      title:      a.title,
      type:       a.type,
      deadline:   a.deadline,
      totalMarks: a.totalMarks,
    })),
    recentActivity: recentActivity.map(p => ({
      course:     p.course?.title,
      completion: p.overallCompletion,
      updatedAt:  p.updatedAt,
    })),
    announcements: announcements.map(a => ({
      id:         a._id,
      title:      a.title,
      message:    a.message,
      instructor: a.instructor?.fullName,
      createdAt:  a.createdAt,
    })),
  };
};
