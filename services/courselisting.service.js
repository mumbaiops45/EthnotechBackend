const Batch    = require("../model/Batch.model");
const Course   = require("../model/Course.model");
const Progress = require("../model/Progress.model");
const Lesson   = require("../model/Lesson.model");

exports.getMyPrograms = async (studentId) => {
  const batches = await Batch.find({ students: studentId })
    .populate({
      path:     "courses",
      populate: { path: "modules.lessons", select: "title duration isMandatory" }
    });

  return batches.map(b => ({
    batchId:   b._id,
    batchName: b.name,
    branch:    b.branch,
    program:   b.program,
    courses:   b.courses,
  }));
};

exports.getMyCourses = async (studentId) => {
  const batches   = await Batch.find({ students: studentId });
  const courseIds = batches.flatMap(b => b.courses);

  const courses = await Course.find({ _id: { $in: courseIds } })
    .populate("instructor",     "fullName")
    .populate("modules.lessons","title duration isMandatory order");

  const progressRecords = await Progress.find({
    student: studentId,
    course:  { $in: courseIds }
  });

  return courses.map(course => {
    const progress     = progressRecords.find(
      p => p.course.toString() === course._id.toString()
    );
    const allLessons   = course.modules?.flatMap(m => m.lessons) || [];
    const totalLessons = allLessons.length;
    const totalDuration= allLessons.reduce((sum, l) => sum + (l.duration || 0), 0);

    return {
      _id:               course._id,
      title:             course.title,
      description:       course.description,
      coverImage:        course.coverImage,
      category:          course.category,
      program:           course.program,
      instructor:        course.instructor?.fullName,
      totalModules:      course.modules?.length || 0,
      totalLessons,
      totalDurationMins: totalDuration,
      overallCompletion: progress?.overallCompletion || 0,
      isPublished:       course.isPublished,
    };
  });
};

exports.getCourseDetail = async (studentId, courseId) => {
  const course = await Course.findById(courseId)
    .populate("instructor",      "fullName email")
    .populate("modules.lessons", "title description duration isMandatory order videoUrl resources");

  if (!course) throw new Error("Course not found");

  const progress = await Progress.findOne({ student: studentId, course: courseId });
  const completedLessonIds = progress?.lessons
    .filter(l => l.isCompleted)
    .map(l => l.lesson.toString()) || [];

  
  const modules = course.modules.map((mod, modIndex) => {
    let prevLessonCompleted = modIndex === 0; 

    const lessons = mod.lessons.map((lesson, lessonIndex) => {
      const isCompleted = completedLessonIds.includes(lesson._id.toString());
      const isUnlocked  = lessonIndex === 0
        ? true
        : completedLessonIds.includes(mod.lessons[lessonIndex - 1]?._id?.toString());

      const lessonProgress = progress?.lessons.find(
        l => l.lesson.toString() === lesson._id.toString()
      );

      return {
        _id:           lesson._id,
        title:         lesson.title,
        description:   lesson.description,
        duration:      lesson.duration,
        isMandatory:   lesson.isMandatory,
        order:         lesson.order,
        isCompleted,
        isUnlocked,    
        isLocked:      !isUnlocked,
        watchPercent:  lessonProgress?.watchPercent || 0,
        resources:     isUnlocked ? lesson.resources : [], 
      };
    });

    return {
      _id:      mod._id,
      title:    mod.title,
      order:    mod.order,
      lessons,
      completedCount: lessons.filter(l => l.isCompleted).length,
      totalCount:     lessons.length,
    };
  });

  return {
    _id:               course._id,
    title:             course.title,
    description:       course.description,
    coverImage:        course.coverImage,
    category:          course.category,
    program:           course.program,
    instructor:        course.instructor,
    overallCompletion: progress?.overallCompletion || 0,
    attendancePercent: progress?.attendancePercent || 0,
    modules,
  };
};