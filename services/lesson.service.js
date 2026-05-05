const Lesson = require("../model/Lesson.Model");
const Course = require("../model/Course.model");

exports.getLessonByModule = async (courseId , moduleId) => {
    const lessons = await Lesson.find({
        course: CourseId, 
        module: moduleId
    }).sort({ order: 1});

    return lessons;
}

exports.getLessonById = async (lessonId) => {
    const lesson = await Lesson.findById(lessonId);

    if(!lesson) throw new Error("Lesson not found");

    return lesson;
}

exports.createLesson = async (courseId, moduleId, data) => {
    const lesson = await Lesson.create({
        ...data,
        course: courseId,
        module: moduleId
    });

    await Course.findOneAndUpdate(
        { _id: courseId, "modules._id": moduleId },
        { $push: { "modules.$.lessons": lesson._id } }
    );

    return lesson;
};

exports.updateLesson = async (lessonId, data) => {
    const lesson = await Lesson.findByIdAndUpdate(
        lessonId,
        { $set: data },
        { new: true }
    );

    if (!lesson) throw new Error("Lesson not found");
    return lesson;
};

exports.deleteLesson = async (lessonId) => {
    const lesson = await Lesson.findByIdAndDelete(lessonId);

    if (!lesson) throw new Error("Lesson not found");

    return { message: "Lesson deleted", lesson };
};

exports.reorderLessons = async (courseId, moduleId, orderIds) => {
    await Promise.all(
        orderIds.map((id, index) =>
            Lesson.findByIdAndUpdate(id, { order: index })
        )
    );

    return { message: "Lessons reordered" };
};