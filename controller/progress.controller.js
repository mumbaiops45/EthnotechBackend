const progressService = require("../services/progress.service");

exports.getBatchProgress = async (req, res) => {
    try {
        const instructorId = req.instructor.id;

        const {batch , course , sortBy} = req.query;

        if(!batch){
            return res.status(400).json({message: "Batch is required"});
        }

        const filters = {
            course,
            sortBy
        };

        const progress = await progressService.getBatchProgress(
            instructorId,
            batch, 
            filters
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