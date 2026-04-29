const DescriptiveSubmission = require("../model/DescriptiveSubmission.model");
const Assessment = require("../model/Assessment.model");
const {sendInApp} = require("../utils/notification");


exports.submitDescriptive = async (studentId , assessmentId , data) =>{
    const existing = await DescriptiveSubmission.findOne({
        student: studentId, 
        assessment: assessmentId
    });
    if(existing) throw new Error("Already submitted");

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) throw new Error("Assessment not found");

    if (assessment.deadline && new Date() > assessment.deadline)
        throw new Error("Submission deadline has passed");

    const submission = await DescriptiveSubmission.create({
        assessment: assessmentId,
        student: studentId,
        totalMarks: assessment.totalMarks,
        ...data,
    });

    await sendInApp(
        assessment.instructor,
        `New Submission: ${assessment.title}`,
        `A student has submitted the descriptive assignment "${assessment.title}". Review if from your queue.`,
        "assignment",
        submission._id
    );

    return submission;
};


exports.getPendingSubmissions = async (instructorId) => {
    const assessments = await Assessment.find({
        instructor: instructorId,
        type: "descriptive"
    });
}