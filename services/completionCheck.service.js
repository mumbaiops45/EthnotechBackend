const Progress = require("../model/Progress.model");
const AssessmentAttempt = require("../model/AssessmentAttempt.model");
const DescriptiveSubmit = require("../model/DescriptiveSubmission.model");
const Assessment = require("../model/Assessment.model");
const Course = require("../model/Course.model");


exports.checkCourseCompletion = async (studentId, courseId) => {
    const course = await Course.findById(courseId)
    .populate("modules.lessons");

    if (!course) throw new Error("Course not found");

    const progress = await Progress.findOne({student: studentId , course: courseId});
    if (!progress) return {isComplete: false , reason: "No progress found"};

    const mandatoryLesson = course.modules 
    .flatMap(m => m.lessons)
    .filter(l => l.isMandatory);

    const completedLessons = progress.lessons.filter( l => l.isCompleted);
    const lessonsDone = mandatoryLesson.every(ml => 
        completedLessons.some(cl => cl.lesson.toString() === ml._id.toString())
    );

    if(!lessonsDone) {
        return {isComplete: false , reason: "Mandatory lessons not completed"};
    }

    const mcqAssessments = await Assessment.find({
        course: courseId, 
        type: "mcq",
        isPublished: true
    });

    for (const assessment of mcqAssessments) {
    const passed = await AssessmentAttempt.findOne({
      student: studentId, assessment: assessment._id, isPassed: true
    });
    if (!passed) {
      return { isComplete: false, reason: `MCQ not passed: ${assessment.title}` };
    }
  }

   const descriptiveAssessments = await Assessment.find({
    course: courseId, type: "descriptive", isPublished: true
  });

  for (const assessment of descriptiveAssessments) {
    const passed = await DescriptiveSubmission.findOne({
      student: studentId, assessment: assessment._id,
      status: "published", isPassed: true
    });
    if (!passed) {
      return { isComplete: false, reason: `Assignment not passed: ${assessment.title}` };
    }
  }

   return { isComplete: true };

}