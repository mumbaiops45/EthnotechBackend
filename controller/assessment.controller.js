const assessmentService =require("../services/assessment.service");
const attemptService = require("../services/attempt.service");

exports.createAssessment = async (req, res) => {
    try {
        const assessment = await assessmentService.createAssessment(req.instructor._id , req.body);
        res.status(201).json({message: "Assessment created", assessment});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

exports.publishAssessment = async (req, res) => {
    try {
        const assessment = await assessmentService.publishAssessment(req.params.id , req.instructor._id);
        res.status(200).json({message: "Assessment published", assessment});
    } catch (error) {
        res.status(400).json({message: error.messsage});
    }
};

exports.getAssessments = async (req, res) => {
    try {
        const assessments = await assessmentService.getAssessments(req.instructor._id);
        res.status(200).json(assessments);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

exports.getAssessmentsById = async(req, res) =>{
    try {
        const assessment = await assessmentService.getAssessmentById(req.params.id);
        res.status(200).json(assessment);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.updateAssessment = async (req, res) =>{
    try {
        const assessment = await assessmentService.updateAssessment(req.params.id , req.instructor._id , req.body);
        res.status(200).json({message: "Assessment updated", assessment});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.deleteAssessment = async (req, res) => {
    try {
        const result = await assessmentService.deleteAssessment(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.getAssessmentForStudent = async (req, res) => {
  try {
    const assessment = await assessmentService.getAssessmentForStudent(req.params.id);
    res.status(200).json(assessment);
  } catch (err) { res.status(404).json({ message: err.message }); }
};

exports.getAllAttemptsForInstructor = async (req, res) => {
  try {
    const attempts = await attemptService.getAllAttemptsForInstructor(req.params.id);
    res.status(200).json(attempts);
  } catch (err) { res.status(400).json({ message: err.message }); }
};
