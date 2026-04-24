const Progress = require("../model/Progress.model");


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


exports.getStudentProgress = async (studentId , courseId) => {
    const progress = await Progress.findOne({student: studentId, course: courseId})
    .populate("lessons.lesson", "title")
    .populate("assignments.assignment", "title totalMarks");

    if(!progress) throw new Error("Progress not found");
    return progress;
}
