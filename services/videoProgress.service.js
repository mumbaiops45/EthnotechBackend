const VideoProgress = require("../model/VideoProgress.model");
const Progress = require("../model/Progress.model");
const Lesson = require("../model/Lesson.Model");


exports.saveProgress = async (studentId, lessonId, courseId, { position, totalDuration }) => {
  const watchPercent = totalDuration > 0
    ? Math.round((position / totalDuration) * 100)
    : 0;

  const lesson = await Lesson.findById(lessonId);
  const minRequired = lesson?.minWatchPercent || 80;
  const isCompleted = watchPercent >= minRequired;

  const videoProgress = await VideoProgress.findOneAndUpdate(
    { student: studentId, lesson: lessonId },
    {
      $set: {
        lastPosition:  position,
        totalDuration,
        watchPercent,
        isCompleted,
        course:        courseId,
        lastSavedAt:   new Date(),
      },
      $push: {
        sessions: {
          startedAt: new Date(),
          position,
        }
      }
    },
    { upsert: true, new: true }
  );

  
  const progress = await Progress.findOne({ student: studentId, course: courseId });
  if (progress) {
    const lessonEntry = progress.lessons.find(
      l => l.lesson.toString() === lessonId
    );

    if (lessonEntry) {
      lessonEntry.watchPercent = watchPercent;
      lessonEntry.isCompleted  = isCompleted;
    } else {
      progress.lessons.push({ lesson: lessonId, watchPercent, isCompleted });
    }

    
    const total     = progress.lessons.length;
    const completed = progress.lessons.filter(l => l.isCompleted).length;
    progress.overallCompletion = total > 0
      ? Math.round((completed / total) * 100)
      : 0;

    await progress.save();
  }

  return { videoProgress, isCompleted, watchPercent };
};


exports.getResumePosition = async (studentId, lessonId) => {
  const videoProgress = await VideoProgress.findOne({
    student: studentId, lesson: lessonId
  });

  return {
    lastPosition: videoProgress?.lastPosition || 0,
    watchPercent: videoProgress?.watchPercent || 0,
    isCompleted:  videoProgress?.isCompleted  || false,
  };
};


exports.checkLessonAccess = async (studentId, lessonId, courseId) => {
  const lesson  = await Lesson.findById(lessonId);
  const course  = await require("../model/Course.model").findById(courseId)
    .populate("modules.lessons");

  if (!lesson || !course) throw new Error("Lesson or course not found");

  
  let prevLessonId = null;
  for (const mod of course.modules) {
    for (let i = 0; i < mod.lessons.length; i++) {
      if (mod.lessons[i]._id.toString() === lessonId) {
        if (i === 0) return { hasAccess: true }; 
        prevLessonId = mod.lessons[i - 1]._id;
      }
    }
  }

  if (!prevLessonId) return { hasAccess: true };

  const prevProgress = await VideoProgress.findOne({
    student: studentId, lesson: prevLessonId
  });

  const hasAccess = prevProgress?.isCompleted || false;
  return {
    hasAccess,
    message: hasAccess ? "Access granted" : "Complete previous lesson first",
  };
};