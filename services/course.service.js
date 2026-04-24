const Course = require("../model/Course.model");

exports.createCourse = async (instructorId, data) => {
    const course = await Course.create({ ...data, instructor: instructorId });
    return course;
}


exports.getCourses = async (instructorId) => {
    return Course.find({ instructor: instructorId }).populate("modules.lessons");
};

exports.getCourseById = async (courseId , instructorId) => {
    const course = await Course.findOne({
        _id: courseId,
        instructor: instructorId
    }).populate("modules.lessons");

    if(!course) throw new Error("Course not found");

    return course;
}

exports.updateCourse = async (courseId, data) => {
    const course = await Course.findByIdAndUpdate(
        courseId, { $set: data }, { new: true }
    );
    if (!course) throw new Error("Course not found");
    return course;
};

exports.deleteCourse = async (courseId) => {
    const course = await Course.findByIdAndDelete(courseId);
    if (!course) throw new Error("Course not found");
    return { message: "Course deleted" };
};


exports.addModule = async (courseId, moduleData) => {
    const course = await Course.findById(courseId);
    if (!course) throw new Error("Course not found");
    course.modules.push(moduleData);
    await course.save();
    return course;
}

exports.reorderModules = async (courseId, orderIds) => {
    const course = await Course.findById(courseId);
    if (!course) throw new Error("Course not found");

    course.modules = orderIds.map((id, index) => {
        const mod = course.modules.id(id);
        if(!mod) throw new Error("Module not found");
        mod.order = index;
        return mod;
    });

    await course.save();
    return course;
};

