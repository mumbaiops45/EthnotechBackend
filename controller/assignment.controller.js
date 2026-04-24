const assignmentService = require("../services/assignment.model");


exports.createAssignment = async (req, res) => {
    try {
        const instructorId = req.instructor.id;

        const assignment = await assignmentService.createAssignment(instructorId,
            req.body
        );

        res.status(201).json({
            message: "Assignment created",
            assignment
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.getAssignments = async (req, res) => {
    try {
        const instructorId = req.instructor.id;

        const assignments = await assignmentService.getAssignments(instructorId);

        res.status(200).json(assignments);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.updateAssignment = async (req, res) => {
    try {
        const assignment = await assignmentService.updateAssignment(req.params.id,
            req.body
        );

        res.status(200).json({
            message: "Assignment updated",
            assignment
        });
    } catch (error) {
       res.status(400).json({message: error.message}); 
    }
};

exports.deleteAssignment = async (req, res) => {
    try {
        const result = await assignmentService.deleteAssignment(req.params.id);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

