const lessonService = require("../services/lesson.service");


exports.createLesson = async (req, res) => {
    try {
        const lesson = await lessonService.createLesson(
            req.params.courseId,
            req.params.moduleId,
            req.body
        );

        res.status(201).json({message: "Leasson created" , lesson});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.updateLesson = async(req,res) => {
    try {
        const lesson = await lessonService.updateLesson(
            req.params.lessonId,
            req.body
        );

        res.status(200).json({message: "Lesson updated", lesson});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


exports.deleteLesson = async (req, res) =>{
    try {
        const result = await lessonService.deleteLesson(req.params.lessonId);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.reorderLessons = async (req, res) => {
    try {
        const result = await lessonService.reorderLessons(
            req.params.courseId,
            req.params.moduleId,
            req.body.orderIds
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};