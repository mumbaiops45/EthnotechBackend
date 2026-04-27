const assignmentReviewService = require("../services/assignmentReview.service");
const { assignCourses } = require("./batch.controller");

exports.submitAssignment = async (req, res) => {
    try {
        const submission = await assignmentReviewService.submitAssignment(req.user.id , req.params.assignmentId , req.body);

        res.status(201).json({ message: "Assignment submitted", submission });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.getPendingSubmissions = async (req, res) => {
    try {
        const submissions = await assignmentReviewService.getPendingSubmittions(req.instructor._id);
        res.status(200).json(submissions);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


exports.getSubmissionById = async (req , res) => {
    try {
        const submission = await assignmentReviewService.getSubmissionById(req.params.id);
        res.status(200).json(submission);
    } catch (error) {
       res.status(404).json({ message: error.message }); 
    }
}


exports.gradeSubmission = async (req, res) => {
    try {
        const submission = await assignmentReviewService.gradeSubmission(req.params.id, req.instructor._id, req.body);

        res.status(200).json({message: "Submission grade", submission});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


exports.publishResult = async (req, res) => {
    try {
        const result = await assignmentReviewService.publishResult(req.params.id);
        res.status(200).json(result);
    } catch (error) {
         res.status(400).json({ message: err.message });
    }
}



exports.getSubmissionsByAssignment = async (req, res) => {
  try {
    const submissions = await assignmentReviewService.getSubmissionsByAssignment(
      req.params.assignmentId
    );
    res.status(200).json(submissions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

