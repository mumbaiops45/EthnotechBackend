// const Progress = require("../model/Progress.model");
const Progress = require("../model/Progress.model");
const Course = require("../model/Course.model");


exports.getBatchProgress = async (instructorId, batch, filters = {}) => {
    const query = { batch };
    if (filters.course) query.course = filters.course;

    const progress = await Progress.find(query)
        .populate("student", "fullName email mobile")
        .populate("course", "title")
        .populate("lessons.lesson", "title isMandatory")
        .populate("assignments.assignment", "title totalMarks passingMarks");


    if (filters.sortBy === "completion") {
        progress.sort((a, b) => b.overallCompletion - a.overallCompletion);
    } else if (filters.sortBy === "attendance") {
        progress.sort((a, b) => b.attendancePercent - a.attendancePercent);
    }

    return progress;
};


exports.initProgress = async (studentId, courseId, batchId = null) => {

  const existing = await Progress.findOne({
    student: studentId,
    course: courseId
  });

  if (existing) return existing;

  const course = await Course.findById(courseId)
    .populate("modules.lessons");

  if (!course) throw new Error("Course not found");

  const allLessons = course.modules?.flatMap(m => m.lessons) || [];

  const progress = await Progress.create({
    student: studentId,
    course: courseId,
    batch: batchId,

    lessons: allLessons.map(l => ({
      lesson: l._id,
      watchPercent: 0,
      isCompleted: false,
    })),

    assignments: [],
    attendancePercent: 0,
    overallCompletion: 0,
  });

  return progress;
};


exports.getStudentProgress = async (studentId , courseId) => {
    // const progress = await Progress.findOne({student: studentId, course: courseId})
    // .populate("lessons.lesson", "title isMandatory minWatchPercent")
    // .populate("assignments.assignment", "title totalMarks");

    // if(!progress) throw new Error("Progress not found");
    // return progress;
    let progress = await Progress.findOne({
  student: studentId,
  course: courseId
});

if (!progress) {
  progress = await exports.initProgress(studentId, courseId);
}
};


exports.updateLessonProgress = async (studentId , courseId , lessonId , watchPercent) => {
    const progress = await Progress.findOne({ student: studentId, course: courseId });
  if (!progress) throw new Error("Progress not found. Student not enrolled.");

  // Find lesson entry
  const lessonEntry = progress.lessons.find(
    l => l.lesson.toString() === lessonId
  );

  if (lessonEntry) {
    lessonEntry.watchPercent = watchPercent;

   
    const course  = await Course.findById(courseId).populate("modules.lessons");
    const lesson  = course.modules.flatMap(m => m.lessons)
      .find(l => l._id.toString() === lessonId);

    const minRequired = lesson?.minWatchPercent || 80;
    if (watchPercent >= minRequired) {
      lessonEntry.isCompleted = true;
    }
  } else {
   
    progress.lessons.push({
      lesson:       lessonId,
      watchPercent,
      isCompleted:  watchPercent >= 80,
    });
    }

 
  const totalLessons     = progress.lessons.length;
  const completedLessons = progress.lessons.filter(l => l.isCompleted).length;
  progress.overallCompletion = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  await progress.save();
  return progress;
}


exports.initProgress = async (studentId, courseId, batchId) => {
  const existing = await Progress.findOne({ student: studentId, course: courseId });
  if (existing) return existing;

  const course = await Course.findById(courseId).populate("modules.lessons");
  if (!course) throw new Error("Course not found");

  const allLessons = course.modules?.flatMap(m => m.lessons) || [];

  const progress = await Progress.create({
    student:  studentId,
    course:   courseId,
    batch:    batchId,
    lessons:  allLessons.map(l => ({
      lesson:       l._id,
      watchPercent: 0,
      isCompleted:  false,
    })),
    assignments:       [],
    attendancePercent: 0,
    overallCompletion: 0,
  });

  return progress;
};