const AssessmentAttempt = require("../model/AssessmentAttempt.model");
const Assessment = require("../model/Assessment.model");
const Question = require("../model/Question.model");
const {sendInApp} = require("../utils/notification");


exports.checkRetakeEligibility = async (studentId , assessmentId) => {
    const assessment = await Assessment.findById(assessmentId);
    if(!assessment) throw new Error('Assessment not found');

    const attempts = await AssessmentAttempt.find({
        student: studentId,
        assessment: assessmentId,
        status: "graded",
    }).sort({ createdAt: -1});


    const attemptCount = attempts.length;
    const maxAllowed = assessment.maxRetakes + 1;

    if (attemptCount >= maxAllowed) {
        throw new Error(`Maximum attempts (${maxAllowed})  reached`);
    }

    if (attempts.length > 0) {
    const lastAttempt  = attempts[0];
    const cooldownMs   = assessment.cooldownHours * 60 * 60 * 1000;
    const nextAllowed  = new Date(lastAttempt.submittedAt.getTime() + cooldownMs);
    if (new Date() < nextAllowed) {
      const minutesLeft = Math.ceil((nextAllowed - new Date()) / 60000);
      throw new Error(`Cooldown active. Retry available in ${minutesLeft} minutes`);
    }
  }

  return { eligible: true, attemptNumber: attemptCount + 1 };
};


exports.startAttempt = async (studentId, assessmentId) => {
  const { attemptNumber } = await exports.checkRetakeEligibility(studentId, assessmentId);

  const attempt = await AssessmentAttempt.create({
    assessment:    assessmentId,
    student:       studentId,
    attemptNumber,
    startedAt:     new Date(),
    status:        "in-progress",
  });

  return attempt;
};

// exports.submitAttempt = async (attemptId, studentId, answers, autoSubmitted = false) => {
//   const attempt = await AssessmentAttempt.findOne({
//     _id: attemptId, student: studentId, status: "in-progress"
//   });
//   if (!attempt) throw new Error("Attempt not found or already submitted");

//   const assessment = await Assessment.findById(attempt.assessment)
//     .populate("questions.question");

//       const submittedAt     = new Date();
//   const timeTakenSeconds = Math.floor((submittedAt - attempt.startedAt) / 1000);

//   let scoredMarks = 0;
//   const gradedAnswers = [];

//   for (const ans of answers) {
//     const qEntry   = assessment.questions.find(
//       q => q.question._id.toString() === ans.questionId
//     );
//     if (!qEntry) continue;

//     const question      = qEntry.question;
//     const selectedOption = question.options[ans.selectedOption];
//     const isCorrect     = selectedOption?.isCorrect || false;
//     const marksAwarded  = isCorrect ? qEntry.marks : 0;
//     scoredMarks        += marksAwarded;

//      gradedAnswers.push({
//       question:       question._id,
//       selectedOption: ans.selectedOption,
//       isCorrect,
//       marksAwarded,
//     });
//   }

// //   const percentage = Math.round((scoredMarks / assessment.totalMarks) * 100);
// const percentage = assessment.totalMarks > 0 ? Math.round((scoredMarks / assessment.totalMarks ) * 100 ) : 0;
//   const isPassed   = percentage >= assessment.passingPercent;

//   attempt.answers          = gradedAnswers;
//   attempt.submittedAt      = submittedAt;
//   attempt.timeTakenSeconds = timeTakenSeconds;
//   attempt.totalMarks       = assessment.totalMarks;
//   attempt.scoredMarks      = scoredMarks;
//   attempt.percentage       = percentage;
//   attempt.isPassed         = isPassed;
//   attempt.autoSubmitted    = autoSubmitted;
//   attempt.status           = "graded";

//   await attempt.save();

//   const result = {
//     attemptId:    attempt._id,
//     totalMarks:   assessment.totalMarks,
//     scoredMarks,
//     percentage,
//     isPassed,
//     timeTakenSeconds,
//     autoSubmitted,
//     passingPercent: assessment.passingPercent,
//     canRetake: assessment.maxRetakes > 0,
//   };
//  if (assessment.showCorrectAnswers) {
//     result.breakdown = gradedAnswers.map(a => {
//       const qEntry   = assessment.questions.find(
//         q => q.question._id.toString() === a.question.toString()
//       );
//       return {
//         question:       qEntry?.question.text,
//         selectedOption: a.selectedOption,
//         isCorrect:      a.isCorrect,
//         marksAwarded:   a.marksAwarded,
//         explanation:    qEntry?.question.explanation,
//         correctOption:  qEntry?.question.options.findIndex(o => o.isCorrect),
//       };
//     });
//   }

//   await sendInApp(
//     studentId,
//     `📊 Result: ${assessment.title}`,
//     `You scored ${scoredMarks}/${assessment.totalMarks} (${percentage}%) — ${isPassed ? "✅ Passed" : "❌ Failed"}`,
//     "result",
//     attempt._id
//   );

//   return result;
// };

exports.submitAttempt = async (attemptId, studentId, answers, autoSubmitted = false) => {
  const attempt = await AssessmentAttempt.findOne({
    _id: attemptId, student: studentId, status: "in-progress"
  });
  if (!attempt) throw new Error("Attempt not found or already submitted");

  const assessment = await Assessment.findById(attempt.assessment)
    .populate("questions.question");

  if (!assessment) throw new Error("Assessment not found");

  let totalMarks = assessment.totalMarks;
  if (!totalMarks || totalMarks === 0) {
    totalMarks = assessment.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
  }

  const submittedAt      = new Date();
  const timeTakenSeconds = Math.floor((submittedAt - attempt.startedAt) / 1000);

  let scoredMarks  = 0;
  const gradedAnswers = [];

  for (const ans of answers) {
    const qEntry = assessment.questions.find(
      q => q.question._id.toString() === ans.questionId
    );
    if (!qEntry) continue;

    const question       = qEntry.question;
    const selectedOption = question.options[ans.selectedOption];
    const isCorrect      = selectedOption?.isCorrect || false;
    const marksAwarded   = isCorrect ? (qEntry.marks || 1) : 0;
    scoredMarks         += marksAwarded;

    gradedAnswers.push({
      question:       question._id,
      selectedOption: ans.selectedOption,
      isCorrect,
      marksAwarded,
    });
  }


  const percentage = totalMarks > 0
    ? Math.round((scoredMarks / totalMarks) * 100)
    : 0;

  const isPassed = percentage >= (assessment.passingPercent || 40);

  attempt.answers          = gradedAnswers;
  attempt.submittedAt      = submittedAt;
  attempt.timeTakenSeconds = timeTakenSeconds;
  attempt.totalMarks       = totalMarks;   
  attempt.scoredMarks      = scoredMarks;
  attempt.percentage       = percentage;
  attempt.isPassed         = isPassed;
  attempt.autoSubmitted    = autoSubmitted;
  attempt.status           = "graded";

  await attempt.save();

  return {
    attemptId:      attempt._id,
    totalMarks,
    scoredMarks,
    percentage,
    isPassed,
    timeTakenSeconds,
    autoSubmitted,
    passingPercent: assessment.passingPercent,
    canRetake:      assessment.maxRetakes > 0,
  };
};


exports.getStudentAttemptHistory = async (studentId, assessmentId) => {
  return AssessmentAttempt.find({
    student:    studentId,
    assessment: assessmentId,
    status:     "graded",
  })
    .populate("assessment", "title totalMarks passingPercent")
    .sort({ createdAt: -1 });
};


exports.getAllAttemptsForInstructor = async (assessmentId) => {
  return AssessmentAttempt.find({ assessment: assessmentId, status: "graded" })
    .populate("student",    "fullName email mobile")
    .populate("assessment", "title totalMarks")
    .sort({ createdAt: -1 });
};
