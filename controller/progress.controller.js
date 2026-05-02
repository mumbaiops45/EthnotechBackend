const progressService = require("../services/progress.service");

exports.getBatchProgress = async (req, res) => {
    try {
        const instructorId = req.instructor.id;

        // const {batch , course , sortBy} = req.query;
        const batch = req.params.batch;
        

        const { course, sortBy } = req.query;

        if(!batch){
            return res.status(400).json({message: "Batch is required"});
        }

        // const filters = {
        //     course,
        //     sortBy
        // };

        const progress = await progressService.getBatchProgress(
            instructorId,
            batch,
            { course, sortBy } 
            // filters
        );

        res.status(200).json(progress);
    } catch (error) {
         res.status(400).json({ message: error.message });
    }
};


exports.getStudentProgress = async (req, res) => {
    try{
        const {studentId , courseId} = req.params;
       

        const progress = await progressService.getStudentProgress(
            studentId,
            courseId
        );

        res.status(200).json(progress)
    } catch(error){
        res.status(404).json({ message: error.message});
    }
}


exports.updateLessonProgress = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId, lessonId, watchPercent } = req.body;
    const progress = await progressService.updateLessonProgress(
      studentId, courseId, lessonId, watchPercent
    );
    res.status(200).json({ message: "Progress updated", progress });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.getMyProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
   
    const progress = await progressService.getStudentProgress(req.user.id, courseId);
    
    res.status(200).json(progress);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};