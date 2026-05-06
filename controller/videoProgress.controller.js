const videoProgressService = require("../services/videoProgress.service");

exports.saveProgress = async (req, res) => {
  try {
    const { lessonId, courseId, position, totalDuration } = req.body;
    const result = await videoProgressService.saveProgress(
      req.user.id, lessonId, courseId, { position, totalDuration }
    );
    res.status(200).json(result);
  } catch (err) { res.status(400).json({ message: err.message }); }
};


exports.getResumePosition = async (req, res) => {
  try {
    const result = await videoProgressService.getResumePosition(
      req.user.id, req.params.lessonId
    );
    res.status(200).json(result);
  } catch (err) { res.status(400).json({ message: err.message }); }
};


exports.checkLessonAccess = async (req, res) => {
  try {
    const result = await videoProgressService.checkLessonAccess(
      req.user.id, req.params.lessonId, req.params.courseId
    );
    res.status(200).json(result);
  } catch (err) { res.status(400).json({ message: err.message }); }
};