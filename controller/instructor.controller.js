const instructorService  = require("../services/instructor.service");


exports.login = async(req , res) => {
    try {
        const result = await instructorService.login(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


exports.getProfile = async (req, res ) => {
    try {
        const profile = await instructorService.getProfile(req.instructor.id);
        res.status(200).json(profile);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const profile = await instructorService.updateProfile(req.instructor.id , req.body);
        res.status(200).json({message: "Profile updated", profile});
    } catch (error){
        res.status(400).json({message: error.message});
    }
}


exports.getMyCourses = async (req, res) => {
  try {
    const courses = await instructorService.getMyCourses(req.instructor._id);
    res.status(200).json(courses);
  } catch (err) { res.status(400).json({ message: err.message }); }
};


exports.getMyBatches = async (req, res) => {
  try {
    const batches = await instructorService.getMyBatches(req.instructor._id);
    res.status(200).json(batches);
  } catch (err) { res.status(400).json({ message: err.message }); }
};


exports.getMyStudents = async (req, res) => {
  try {
    const students = await instructorService.getMyStudents(req.instructor._id);
    res.status(200).json(students);
  } catch (err) { res.status(400).json({ message: err.message }); }
};


exports.getCourseStudents = async (req, res) => {
  try {
    const students = await instructorService.getCourseStudents(
      req.instructor._id,
      req.params.courseId
    );
    res.status(200).json(students);
  } catch (err) { res.status(400).json({ message: err.message }); }
};


exports.getMyDashboard = async (req, res) => {
  try {
    const dashboard = await instructorService.getMyDashboard(req.instructor._id);
    res.status(200).json(dashboard);
  } catch (err) { res.status(400).json({ message: err.message }); }
};