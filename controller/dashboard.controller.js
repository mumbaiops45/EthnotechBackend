const dashboardService = require("../services/student.dashoard.service");
const courseListingService = require("../services/courselisting.service");
const completionService = require("../services/courseCompletion.service");


exports.getDashboard = async (req, res) => {
  try {
    const dashboard = await dashboardService.getDashboard(req.user.id);
    res.status(200).json(dashboard);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getMyPrograms = async (req, res) => {
  try {
    const programs = await courseListingService.getMyPrograms(req.user.id);
    res.status(200).json(programs);
  } catch (err) { res.status(400).json({ message: err.message }); }
};


exports.getMyCourses = async (req, res) => {
  try {
    const courses = await courseListingService.getMyCourses(req.user.id);
    res.status(200).json(courses);
  } catch (err) { res.status(400).json({ message: err.message }); }
};


exports.getCourseDetail = async (req, res) => {
  try {
    const detail = await courseListingService.getCourseDetail(
      req.user.id, req.params.courseId
    );
    res.status(200).json(detail);
  } catch (err) { res.status(404).json({ message: err.message }); }
};


exports.getCourseCompletion = async (req, res) => {
  try {
    const completion = await completionService.getCourseCompletion(
      req.user.id, req.params.courseId
    );
    res.status(200).json(completion);
  } catch (err) { res.status(400).json({ message: err.message }); }
};