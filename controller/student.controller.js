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

exports.getProfile = async (req, res) => {
  try {
    const profile = await StudentService.getProfile(req.user.id);

    res.json(profile);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
};

exports.createProfile = async (req, res) => {
  try {
    const profile = await StudentService.createProfile(req.user.id, req.body);

    res.status(201).json({
      message: "Profile created successfully",
      profile,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) =>{
  try {
    const profile = await StudentService.updateProfile(req.user.id , req.body);

    res.json({
      message: "Profile update successfully",
      profile,
    });
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};


exports.deleteProfile = async (req, res) =>{
  try {
    const result = await StudentService.deleteProfile(req.user.id);

    res.json(result);
  } catch (error) {
    res.status(400).json({message: err.deleteProfile});
  }
};

