const Batch = require("../model/Batch.model");
const Student = require("../model/student.model");

exports.createBatch = async (data , createdBy) => {
    const batch = await Batch.create({...data, createdBy});
    return batch;
};


exports.getAllBatches = async (filters = {}) => {
    const query = {};

    if(filters.branch) query.branch = filters.branch;
    if(filters.program) query.program = filters.program;
    if (filters.isActive) query.isActive = filters.isActive;

    return Batch.find(query)
    .populate("instructor", "fullName email")
    .populate("students",   "fullName email mobile")
    .populate("courses",    "title category");
};

exports.getBatchById = async (batchId) => {
  const batch = await Batch.findById(batchId)
    .populate("instructor", "fullName email")
    .populate("students",   "fullName email mobile")
    .populate("courses",    "title category");
  if (!batch) throw new Error("Batch not found");
  return batch;
};


exports.updateBatch = async (batchId, data) => {
  const batch = await Batch.findByIdAndUpdate(
    batchId, { $set: data }, { new: true }
  );
  if (!batch) throw new Error("Batch not found");
  return batch;
};


exports.deleteBatch = async (batchId) => {
  await Batch.findByIdAndDelete(batchId);
  return { message: "Batch deleted successfully" };
};


exports.assignInstructor = async (batchId, instructorId) => {
  const batch = await Batch.findByIdAndUpdate(
    batchId,
    { $set: { instructor: instructorId } },
    { new: true }
  ).populate("instructor", "fullName email");
  if (!batch) throw new Error("Batch not found");
  return batch;
};



exports.addStudents = async (batchId, studentIds) => {
  const batch = await Batch.findByIdAndUpdate(
    batchId,
    { $addToSet: { students: { $each: studentIds } } }, 
    { new: true }
  ).populate("students", "fullName email mobile");
  if (!batch) throw new Error("Batch not found");
  return batch;
};



exports.removeStudent = async (batchId, studentId) => {
  const batch = await Batch.findByIdAndUpdate(
    batchId,
    { $pull: { students: studentId } },
    { new: true }
  );
  if (!batch) throw new Error("Batch not found");
  return { message: "Student removed from batch" };
};


exports.assignCourses = async (batchId, courseIds) => {
  const batch = await Batch.findByIdAndUpdate(
    batchId,
    { $addToSet: { courses: { $each: courseIds } } },
    { new: true }
  ).populate("courses", "title category");
  if (!batch) throw new Error("Batch not found");
  return batch;
};