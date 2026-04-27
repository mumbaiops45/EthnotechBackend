const express = require('express')
const app = express()
const port = 8080
require("dotenv").config();
const connectDB = require("./config/db");
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



const cors = require("cors");


app.use(express.json());
app.use(cors());
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


app.listen(8080, () => {
  console.log("Server running on port 5000");
});