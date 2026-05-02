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


app.use("/certificate-templates", CertificateTemplateRoutes);
app.use("/certificates",          certificateRoutes);



runReminderJob();
app.listen(8080, () => {
  console.log("Server running on port 5000");
});