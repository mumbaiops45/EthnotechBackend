const Progress = require("../model/Progress.model");
const Course = require("../model/Course.model");
const Assessment = require("../model/Assessment.model");
const AssessmentAttempt = require("../model/AssessmentAttempt.model");
const DescriptiveSubmission = require("../model/DescriptiveSubmission.model");



exports.getCourseCompletion = async (studentId, courseId) => {
  const course   = await Course.findById(courseId).populate("modules.lessons");
  const progress = await Progress.findOne({ student: studentId, course: courseId });

  if (!course || !progress) throw new Error("Course or progress not found");

  const allLessons       = course.modules.flatMap(m => m.lessons);
  const mandatoryLessons = allLessons.filter(l => l.isMandatory);
  const completedLessons = progress.lessons.filter(l => l.isCompleted);

  
  const mcqAssessments = await Assessment.find({
    course: courseId, type: "mcq", isPublished: true
  });
  const descriptiveAssessments = await Assessment.find({
    course: courseId, type: "descriptive", isPublished: true
  });

  let mcqPassed = 0;
  for (const a of mcqAssessments) {
    const passed = await AssessmentAttempt.findOne({
      student: studentId, assessment: a._id, isPassed: true
    });
    if (passed) mcqPassed++;
  }

  let descPassed = 0;
  for (const a of descriptiveAssessments) {
    const passed = await DescriptiveSubmission.findOne({
      student: studentId, assessment: a._id, status: "published", isPassed: true
    });
    if (passed) descPassed++;
  }

  const lessonPercent = mandatoryLessons.length > 0
    ? Math.round((completedLessons.length / mandatoryLessons.length) * 100)
    : 100;

  const mcqPercent = mcqAssessments.length > 0
    ? Math.round((mcqPassed / mcqAssessments.length) * 100)
    : 100;

  const descPercent = descriptiveAssessments.length > 0
    ? Math.round((descPassed / descriptiveAssessments.length) * 100)
    : 100;

  const overallPercent = Math.round((lessonPercent + mcqPercent + descPercent) / 3);

  return {
    courseId,
    overallCompletion: overallPercent,
    breakdown: {
      lessons: {
        completed: completedLessons.length,
        total:     mandatoryLessons.length,
        percent:   lessonPercent,
      },
      mcqAssessments: {
        passed:  mcqPassed,
        total:   mcqAssessments.length,
        percent: mcqPercent,
      },
      descriptiveAssignments: {
        passed:  descPassed,
        total:   descriptiveAssessments.length,
        percent: descPercent,
      },
    },
    modules: course.modules.map(mod => {
      const modLessons   = mod.lessons;
      const modCompleted = progress.lessons.filter(pl =>
        modLessons.some(ml => ml._id.toString() === pl.lesson.toString() && pl.isCompleted)
      );
      return {
        moduleId:   mod._id,
        title:      mod.title,
        completed:  modCompleted.length,
        total:      modLessons.length,
        percent:    modLessons.length > 0
          ? Math.round((modCompleted.length / modLessons.length) * 100)
          : 0,
      };
    }),
  };
};