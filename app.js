const express = require('express')
const app = express()
const port = 8080
require("dotenv").config();
const connectDB = require("./config/db");
const StudentRoute = require("./routes/student.route");

app.use(express.json());
connectDB();

app.use("/student", StudentRoute);

app.listen(8080, () => {
  console.log("Server running on port 5000");
});