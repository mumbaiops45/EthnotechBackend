const Student = require("../model/student.model");
const {generateOTP} = require(".././utils/otp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (data) => {
  const { email, password, mobile } = data;

  const existingStudent = await Student.findOne({ email });
  if (existingStudent) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const student = await Student.create({
    email,
    mobile,
    password: hashedPassword,
  });

  return student;
};


exports.loginUser = async (data) => {
  const { email, password } = data;

  const student = await Student.findOne({ email });
  if (!student) {
    throw new Error("Student not found");
  }

  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: student._id, email: student.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { student, token };
};


