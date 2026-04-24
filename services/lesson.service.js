// const Lesson = require("../model/Lesson.Model");
// const Course = require("../model/Course.model");
// const { getCourseById } = require("./course.service");

// exports.createLesson = async (getCourseById, moduleId , data) => {
//     const lesson = await Lesson.create({...data, course: getCourseById, moduleId});

//     await Course.findOneAndUpdate(
//         {_id: courseId , "modules._id" : moduleId},
//         {$push: {"modules.$.lessons": lesson._id}}
//     );

//     return lesson;
// };

// exports.updateLesson = async (lessonId , data) => {
//     const lesson = await Lesson.findByIdAndUpdate(
//         lessonId, {$set: data}, {new: true}
//     );
//     if (!lesson) throw new Error("Lesson not found");
//     return lesson;
// };

// exports.deleteLesson = async (lessonId) => {
//    const lesson = await Lesson.findByIdAndDelete(lessonId);
//    return {message: "Lesson deleted", lesson}

// }

// exports.reorderLessons = async (courseId, moduleId, orderIds) => {
//     await Promise.all(
//         orderedIds.map((id, index) => Lesson.findByIdAndUpdate(id , {order: index}))
//     );

//     return {message: "Lessons reordered"};
// };



const Lesson = require("../model/Lesson.Model");
const Course = require("../model/Course.model");

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