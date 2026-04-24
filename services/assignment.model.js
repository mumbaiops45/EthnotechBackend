const Assignment = require("../model/Assignment.model");


exports.createAssignment = async(instructorId , data) => {
    const assignment = await Assignment.create({...data, instructor: instructorId
    });
    return assignment;
};

exports.getAssignments = async (instructorId) => {
    return Assignment.find({instructor: instructorId})
    .populate("course", "title")
    .populate("lesson", "title");
};


exports.updateAssignment = async (id , data) => {
    const assignment = await Assignment.findByIdAndUpdate(
        id, {$set: data}, {new: true}
    );
    if(!assignment) throw new Error("Assignment not found");
    return assignment;
};


exports.deleteAssignment = async(id) => {
    const assignment = await Assignment.findByIdAndDelete(id);

    if (!assignment) throw new Error("Assignment not found");

    return {message: "Assignment Delete" ,assignment};
};