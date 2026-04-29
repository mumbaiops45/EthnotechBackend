const DescriptiveSubmission = require("../model/DescriptiveSubmission.model");
const Assessment = require("../model/Assessment.model");
const {sendInApp} = require("../utils/notification");


// exports.submitDescriptive = async (studentId , assessmentId , data) =>{
//     const existing = await DescriptiveSubmission.findOne({
//         student: studentId, 
//         assessment: assessmentId
//     });
//     if(existing) throw new Error("Already submitted");

//     const assessment = await Assessment.findById(assessmentId);
//     if (!assessment) throw new Error("Assessment not found");

//     if (assessment.deadline && new Date() > assessment.deadline)
//         throw new Error("Submission deadline has passed");

//     const submission = await DescriptiveSubmission.create({
//         assessment: assessmentId,
//         student: studentId,
//         totalMarks: assessment.totalMarks,
//         ...data,
//     });

//     await sendInApp(
//         assessment.instructor,
//         `New Submission: ${assessment.title}`,
//         `A student has submitted the descriptive assignment "${assessment.title}". Review if from your queue.`,
//         "assignment",
//         submission._id
//     );

//     return submission;
// };

exports.submitDescriptive = async (studentId , assessmentId , data) => {
    const existing = await DescriptiveSubmission.findOne({
        student: studentId , 
        assessment: assessmentId
    });
    if (existing) throw new Error("Already submitted");

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) throw new Error("Assessment not found");

    if (assessment.deadline && new Date() > assessment.dedline)
        throw new Error("Submission deadline has passed");

    const totalMarks = assessment.totalMarks || 100;

    const submission = await DescriptiveSubmission.create({
        assessment: assessmentId,
        student: studentId,
        totalMarks,
        ...data,
    });

    await sendInApp(
        assessment.instructor,
        `New Submission: ${assessment.titla}`,
        `A student has submitted "${assessment.title}". Review from your queue.`,
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

    const ids = assessments.map(a => a._id);

    return DescriptiveSubmission.find({
        assessment: { $in: ids},
        status: "pending"
    })
    .populate("student", "fullName email mobile")
    .populate("assessment" , "title totalMarks passingPercent")
    .sort({submittedAt: 1});
};


exports.getSubmissionById = async (id) => {
    const submission = await DescriptiveSubmission.findById(id)
    .populate("student", "fullName email")
    .populate("assessment" , "title totalMarks passingPercent");

    if(!submission) throw new Error("Submission not found");
    return submission;
};


// exports.gradeSubmission = async (submissionId , instructorId , {marks, feedback}) => {
//     const submission = await DescriptiveSubmission.findById(submissionId)
//     .populate("assessment");

//     if(!submission) throw new Error("Submission not found");

//     if (marks > submission.assessment.totalMarks)
//         throw new Error(`Marks cannot exceed ${submission.assessment.totalMarks}`);

//     const percentage = Math.round (( marks / submission.assessment.totalMarks) * 100);
//     const isPassed = percentage >= submission.assessment.passingPercent;

//     submission.marks = marks;
//     submission.percentage = percentage;
//     submission.feedback = feedback;
//     submission.gradedAt = new Date();
//     submission.gradedBy = instructorId;
//     submission.isPassed = isPassed;
//     submission.status = "reviewed";

//     await submission.save();
//     return submission;

// };

exports.gradeSubmission = async (submissionId , instructorId, {marks , feedback})=> {
    const submission = await DescriptiveSubmission.findById(submissionId)
    .populate("assessment");

      if (!submission) throw new Error("Submission not found");

     const totalMarks = submission.assessment?.totalMarks
    || submission.totalMarks
    || marks;

    if (totalMarks > 0 && marks > totalMarks)
    throw new Error(`Marks cannot exceed ${totalMarks}`);

  const percentage = totalMarks > 0
    ? Math.round((marks / totalMarks) * 100)
    : 100;

     const isPassed = percentage >= (submission.assessment?.passingPercent || 40);

  submission.marks      = marks;
  submission.totalMarks = totalMarks;
   submission.percentage = percentage;
  submission.feedback   = feedback;
  submission.gradedAt   = new Date();
  submission.gradedBy   = instructorId;
  submission.isPassed   = isPassed;
  submission.status     = "reviewed";

  await submission.save();
  return submission;
}

exports.publishResult = async (submissionId) => {
    const submission = await DescriptiveSubmission.findById(submissionId)
    .populate("student", "fullName email mobile")
    .populate("assessment" , "title totalMarks passingPercent");

    if(!submission) throw new Error("Submission not found");
    if(submission.status !== "reviewed")
        throw new Error("Grade the submission befor publishing");

    submission.status = "published";
    await submission.save();

    await sendInApp(
        submission.student._id,
        `Result Published: ${submission.assessment.title}`,
        `Your result: ${submission.marks}/${submission.totalMarks} (${submission.percentage}%)  — ${submission.isPassed ? " Passed" : " Failed"}. Feedback:${submission.feedback}`,
        "result",
        submission._id
    );

    return { message: "Result published", submission };
};


exports.getStudentSubmissionHistory = async (studentId) => {
  return DescriptiveSubmission.find({ student: studentId, status: "published" })
    .populate("assessment", "title totalMarks")
    .sort({ submittedAt: -1 });
};