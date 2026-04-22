const StudentService = require("../services/student.service");


exports.register = async (req, res) => {
  try {
    const user = await StudentService.registerUser(req.body);

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const result = await StudentService.loginUser(req.body);

    res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.sendResetOtp = async (req, res) => {
  try {
    const result = await StudentService.sendResetOtp(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const result = await StudentService.resetPassword(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};