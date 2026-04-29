const Question = require("../model/Question.model");


exports.createQuestion = async (instructorId , data) => {
    return Question.create({...data , createdBy: instructorId});
};


exports.getQuestions = async (filters  = {} ) => {
    const query = {isActive: true};
    if (filters.subject) query.subject = filters.subject;
    if (filters.topic) query.topic = filters.topic;
    if (filters.difficulty) query.difficulty = filters.difficulty;
    if (filters.type) query.type = filters.type;

    return Question.find(query).sort({createdAt: -1});
};


exports.getQuestionsById = async (id) =>{
    const question = await Question.findById(id);
    if (!question) throw new Error("Question not found");
    return question;
};

exports.updateQuestion = async (id , data) => {
    const question = await Question.findByIdAndUpdate(id , 
        {$set: data}, {new: true}
    );
    if (!question) throw new Error("Question not found");
    return question;
};

exports.deleteQuestion = async (id) => {
    await Question.findByIdAndUpdate(id , { isActive: false});
    return {message: "Question deleted"};
};

exports.getRandomQuestions = async ({ subject, topic , difficulty , count}) => {
    const query = { isActive: true , type: "mcq"};
    if(subject) query.subject = subject;
    if(topic) query.topic = topic;
    if(difficulty) query.difficulty = difficulty;


    return Question.aggregate([
        {$match: query},
        { $sample: {size: parseInt(count)}}
    ]);
};


