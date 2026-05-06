const express = require('express')
const app = express()
const port = 8080
require("dotenv").config();
const connectDB = require("./config/db");
const {runReminderJob} = require("./jobs/reminderJob");
const StudentRoute = require("./routes/student.route");
const adminRoutes = require("./routes/admin.route");
const {seedSuperAdmin} =require("./services/admin.service");
const InstructorRoute = require("./routes/instructor.route");
const courseRoutes = require("./routes/course.route");
const lessonRoutes = require("./routes/lesson.route");
const assignmentRoutes = require("./routes/assignment.route");
const progressRoutes = require("./routes/progress.route");
const batchRoutes = require("./routes/batch.route");
const liveSessionRoutes      = require("./routes/liveSession.route");
const assignmentReviewRoutes = require("./routes/assignmentReview.route");
const announcementRoutes     = require("./routes/announcement.route");
const attendanceRoutes = require("./routes/attendance.route");
const calendarRoutes = require("./routes/calendar.route");
const questionRoutes = require("./routes/question.route");
const assessmentRoutes = require("./routes/assessment.route");
const attemptRoutes     = require("./routes/attempt.route");
const descriptiveRoutes = require("./routes/descriptive.route");
const CertificateTemplateRoutes = require("./routes/certificateTemplate.route");
const certificateRoutes = require("./routes/certificate.route");
const dashboardRoutes = require("./routes/dashboard.route");
const videoProgressRoutes = require("./routes/videoProgress.route");
const notificationRoutes = require("./routes/notification.route");



const cors = require("cors");


app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("uploads"));
// connectDB();
connectDB().then(() => seedSuperAdmin());

app.use("/admins", adminRoutes);
app.use("/student", StudentRoute);
app.use("/instructor" , InstructorRoute);
app.use("/courses",     courseRoutes);
app.use("/lesson",     lessonRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/progress",    progressRoutes);
app.use("/batches", batchRoutes);
app.use("/live-sessions",  liveSessionRoutes);
app.use("/submissions",    assignmentReviewRoutes);
app.use("/announcements",  announcementRoutes);
app.use("/attendance",    attendanceRoutes);
app.use("/calendar",      calendarRoutes);
app.use("/questions",    questionRoutes);
app.use("/assessments",  assessmentRoutes);
app.use("/attempts",     attemptRoutes);
app.use("/descriptive",  descriptiveRoutes);
app.use("/dashboard",      dashboardRoutes);
app.use("/video-progress", videoProgressRoutes);
app.use("/notifications",  notificationRoutes);


app.use("/certificate-templates", CertificateTemplateRoutes);
app.use("/certificates",          certificateRoutes);

// app.post("/test-notification", async (req, res) => {
//   try {
//     console.log("Body:", req.body);
//     console.log("StudentId:", req.body?.studentId);

//     const studentId    = req.body?.studentId;
//     const Notification = require("./model/Notification.model");
//     const Student      = require("./model/student.model");
//     const mongoose     = require("mongoose");

//     // ✅ Validate ObjectId format first
//     if (!mongoose.Types.ObjectId.isValid(studentId)) {
//       return res.status(400).json({ message: "Invalid studentId format" });
//     }

//     // ✅ Check student exists
//     const student = await Student.findById(studentId);
//     console.log("Student found:", student); // ← check terminal

//     if (!student) {
//       return res.status(404).json({
//         message: "Student not found in DB",
//         searchedId: studentId
//       });
//     }

//     const notif = await Notification.create({
//       student:  new mongoose.Types.ObjectId(studentId), // ✅ convert to ObjectId
//       title:    "Test Notification",
//       message:  "This is a test notification",
//       type:     "general",
//       isRead:   false,
//     });

//     res.json({ message: "Notification created", notif });
//   } catch (err) {
//     console.error("Error:", err); // ← full error in terminal
//     res.status(400).json({ message: err.message });
//   }
// });


// app.get("/debug-student/:id", async (req, res) => {
//   try {
//     const Student  = require("./model/student.model");
//     const mongoose = require("mongoose");

//     const id = req.params.id;

//     if (!mongoose.Types.ObjectId.isValid(id))
//       return res.status(400).json({ message: "Invalid ID format" });

//     const student = await Student.findById(id).select("-password -otp");

//     if (!student)
//       return res.status(404).json({ message: "Student not found" });

//     res.json({ found: true, student });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

runReminderJob();
app.listen(8080, () => {
  console.log("Server running on port 5000");
});