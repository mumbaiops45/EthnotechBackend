const questionService = require("../services/question.service");

exports.createQuestion = async (req, res) =>{
    try {
        const instructorId = req.user?.id;
        const question = await questionService.createQuestion(instructorId , req.body);

        res.status(201).json({
            success: true,
            data: question
        });
    } catch (error) {
        res.statis(400).json({message: error.message});
    }
};


exports.getQuestions = async (req, res) => {
    try {
        const questions = await questionService.getQuestions(req.query);

        res.status(200).json({success: true , data: questions});
    } catch (error) {
        res.status(400).json({success:false , message: error.message});
    }
};


exports.getQuestionById = async (req, res) => {
    try {
        const question = await questionService.getQuestionsById(req.params.id);

        res.status(200).json({success: true , data: question});
    } catch (error) {
        res.status(400).json({success: false ,message: error.message});
    }
};


exports.updateQuestion = async (req, res) => {
    try {
        const updatedQuestion = await questionService.updateQuestion(req.params.id, req.body);

        res.status(200).json({success: true , data: updatedQuestion})
    } catch (error) {
        res.status(404).json({success: false , message: error.message});
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const result = await questionService.deleteQuestion(req.params.id);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.getRandomQuestions = async (req, res) => {
    try {
        const questions = await questionService.getRandomQuestions(req.query);

        res.status(200).json({
            success: true,
            data: questions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
