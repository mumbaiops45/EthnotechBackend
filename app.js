const express = require('express')
const app = express()
const port = 8080
require("dotenv").config();
const connectDB = require("./config/db");
const StudentRoute = require("./routes/student.route");
const adminRoutes = require("./routes/admin.route");
const {seedSuperAdmin} =require("./services/admin.service");
const cors = require("cors");

app.use(express.json());
app.use(cors());
// connectDB();
connectDB().then(() => seedSuperAdmin());

app.use("/admins", adminRoutes);
app.use("/student", StudentRoute);


app.get("/check", async (req, res) => {
  const Admin = require("./model/Admin.model");
  const admin = await Admin.findOne({ role: "SuperAdmin" });
  res.json(admin);
});

app.listen(8080, () => {
  console.log("Server running on port 5000");
});