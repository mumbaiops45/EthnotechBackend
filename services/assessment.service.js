const Assessment = require("../model/Assessment.model");
const Question = require("../model/Question.model");
const{notifyStudents} = require("../utils/notification");
const Batch = require("../model/Batch.model");



exports.createAssessment = async (instructorId, data) => {
  let questions = data.questions || [];
  let totalMarks = 0;


  for (const q of questions) {
    const question = await Question.findById(q.question);
    totalMarks += q.marks || question?.marks || 1; 
  }

 
  if (totalMarks === 0 && questions.length > 0) {
    totalMarks = questions.length; 
  }

  const assessment = await Assessment.create({
    ...data,
    questions,
    totalMarks,
    instructor: instructorId,
  });

  return assessment;
};

exports.publishAssessment = async (assessmentId , instructorId) =>{
    const assessment = await Assessment.findOneAndUpdate(
        {_id: assessmentId , instructor: instructorId},
        { $set: {isPublished: true}},
        {new: true}
    );

    if (!assessment) throw new Error("Assessment not found");


    if (assessment.batch){
        const batch = await Batch.findById(assessment.batch)
        .populate("students" , "fullName email mobile");
        
        if (batch?.students?.length > 0){
            const title = `New Assessment: ${assessment.title}`;
            const message = `A new ${assessment.type.toUpperCase()} assessment "${assessment.title}" has been published.${assessment.deadline ? ` Deadline: ${new Date(assessment.deadline).toLocaleString()}` : ""}`;
            await notifyStudents(batch.students , title, message , "assignment", assessment._id);
        }
    }

    return assessment;
};


exports.getAssessments = async (instructorId) => {
    return Assessment.find({instructor: instructorId})
    .populate("course", "title")
    .populate("batch", "name")
    .sort({createdAt: -1});
};


exports.getAssessmentById = async (id) => {
    return Assessment.findById(id)
    .populate("questions.question")
    .populate("course" , "title")
    .populate("batch", "name");
};


exports.updateAssessment = async (id , instructorId , data) => {
    const assessment = await Assessment.findOneAndUpdate(
        {_id: id , instructor: instructorId},
        { $set: data},
        {new : true}
    );
    if (!assessment) throw new Error("Assessment not found");

    return assessment;
};


exports.deleteAssessment = async (id) => {
    await Assessment.findByIdAndDelete(id);
    return {message: "Assessment deleted"};
};

exports.getAssessmentForStudent = async (assessmentId) =>{
    const assessment = await Assessment.findById(assessmentId)
    .populate("questions.question");
    if (!assessment || !assessment.isPublished)
        throw new Error("Assessment not found or not published");


    let questions = assessment.questions.map(q => ({
        _id: q.question._id,
        text: q.question.text,
        marks: q.marks,
        options:  q.question.options.map(( o, i) => ({
            index: i, text: o.text
        })),
        // hide isCorrect from student
    }))

    if (assessment.shuffleQuestions) {
        questions = questions.sort(() => Math.random() - 0.5);
    }


    return {
        _id: assessment._id,
        title: assessment.title,
        description: assessment.description,
        type: assessment.type,
        totalMarks: assessment.totalMarks,
        passingPercent: assessment.passingPercent,
        timeLimitMinutes: assessment.timeLimitMinutes,
        deadline: assessment.deadline,
        questions,
    };
};


