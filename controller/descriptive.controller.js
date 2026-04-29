const descriptiveService = require("../services/descriptive.service");

exports.submitDesciptive = async (req, res) => {
    try {
        const submission = await descriptiveService.submitDescriptive(req.user.id , req.params.assessmentId , req.body);

        res.status(201).json({message: "Submitted successfully",submission });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


exports.getPendingSubmissions = async (req, res) => {
    try {
        const submissions = await descriptiveService.getPendingSubmissions(req.instructor._id);
        res.status(200).json(submissions);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.getSubmissionById = async (req, res) => {
    try {
        const submission = await descriptiveService.getSubmissionById(req.params.id);
        res.status(200).json(submission);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
};


exports.gradeSubmission = async (req, res) => {
    try {
        const submission = await descriptiveService.gradeSubmission(req.params.id , req.instructor._id , req.body);

        res.status(200).json({message:  "Graded successfully", submission});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


exports.publishResult = async (req, res) => {
    try {
        const result = await descriptiveService.publishResult(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.getStudentHistory = async (req, res) => {
  try {
    const history = await descriptiveService.getStudentSubmissionHistory(req.user.id);
    res.status(200).json(history);
  } catch (err) { res.status(400).json({ message: err.message }); }
};


