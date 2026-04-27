const AssignmentSubmission = require("../model/AssignmentSubmission.model");
const Assignment = require("../model/Assignment.model");
const Student = require("../model/student.model");
const {notifyStudents} = require("../utils/notification");

exports.submitAssignment = async (studentId, assignmentId , data) => {
    const existing = await AssignmentSubmission.findOne({
        student: studentId,
        assignment: assignmentId
    });

    if(existing) throw new Error("Assignment already submitted");

    const submission = await AssignmentSubmission.create({
        student: studentId,
        assignment: assignmentId,
        ...data,
    });
    return submission;
};

exports.getPendingSubmissions = async (instructorId) => {
    const assignments = await Assignment.find({ instructor: instructorId});
    const assignmentIds = assignments.map(a => a._id);

    return AssignmentSubmission.find({
        assignment: {$in: assignmentIds},
        status: "pending"
    })
    .populate("student" , "fullName email mobile")
    .populate("assignment", "title totalMarks passingMarks")
    .sort({ submittedAt: 1});
};


exports.getSubmissionById = async (submissionId) => {
    const submission = await AssignmentSubmission.findById(submissionId)
    .populate("student" , "fullName email mobile")
    .populate("assignment" , "title totalMarks passingMarks deadline");

    if(!submission) throw new Error("Susbmission not found");

    return submission;

};


exports.gradeSubmission = async(submissionId, instructorId, { marks, feedback } ) => {
    const submission = await AssignmentSubmission.findById(submissionId)
    .populate("assignment");

    if(!submission) throw new Error("Submission not found");

    if(marks > submission.assignment.totalMarks)
        throw new Error(`MArks cannot exceed total marks (${submission.assignment.totalMarks})`);

    submission.marks = marks;
    submission.feedback = feedback;
    submission.gradedBy = instructorId;
    submission.gradedAt = new Date();
    submission.status = "reviewed";
    submission.isPassed = marks >= submission.assignment.passingMarks;

    await submission.save();
    return submission;
};

exports.publishResult = async (submissionId) => {
    const submission = await AssignmentSubmission.findById(submissionId)
    .populate("student", "fullName email mobile")
    .populate("assignment" , "title totalMarks passingMarks");

    if (!submission) throw new Error("Submission not found");
    if(submission.status !== "reviewed")
        throw new Error("Grade the submission before publishing");
    submission.status = "published";
    await submission.save();

    const subject = `Assignment Result Published: ${submission.assignment.title}`;
    const message = `Your result for "${submission.assignment.title}" has been published.
Marks: ${submission.marks}/${submission.assignment.totalMarks}
Status: ${submission.isPassed ? "✅ Passed" : "❌ Failed"}
Feedback: ${submission.feedback}`;

await notifyStudents([submission.student], subject, message);

  return { message: "Result published and student notified", submission };

}


exports.getSubmissionsByAssignment = async (assignmentId) => {
  return AssignmentSubmission.find({ assignment: assignmentId })
    .populate("student", "fullName email")
    .sort({ submittedAt: 1 });
};