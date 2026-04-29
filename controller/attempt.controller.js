const attemptService = require("../services/attempt.service");


exports.startAttempt = async (req, res) => {
    try {
        const attempt = await  attemptService.startAttempt(req.user.id , req.params.assessmentId);

        res.status(201).json({message: "Attempt started", attempt});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.submitAttempt = async (req, res) => {
  try {
    const { answers, autoSubmitted } = req.body;
    const result = await attemptService.submitAttempt(
      req.params.attemptId, req.user.id, answers, autoSubmitted
    );
    res.status(200).json(result);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getAttemptHistory = async (req, res) => {
  try {
    const history = await attemptService.getStudentAttemptHistory(
      req.user.id, req.params.assessmentId
    );
    res.status(200).json(history);
  } catch (err) { res.status(400).json({ message: err.message }); }
};