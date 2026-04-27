const batchService = require("../services/batch.service");

exports.createBatch = async (req, res) => {
    try {
        const batch = await batchService.createBatch(req.body , req.admin._id);
   res.status(201).json({message: "Batch created", batch});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.getAllBatches = async (req, res) => {
    try {
        const batches = await batchService.getAllBatches(req.query);
        res.status(200).json(batches);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


exports.getBatchById = async (req, res) =>{
    try {
        const batch = await batchService.getBatchById(req.params.id);
        res.status(200).json(batch);
    } catch (error) {
        res.status(404).json({mesage: error.message});
    }
};

exports.updateBatch = async(req, res) => {
    try {
        const batch = await batchService.updateBatch(req.params.id, req.body);
        res.status(200).json({message: "Batch updated", batch});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.deleteBatch = async (req, res) => {
    try {
        const result = await batchService.deleteBatch(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.assignInstructor = async (req , res) => {
    try {
        const batch = await batchService.assignInstructor(
            req.params.id,
            req.body.instructorId 
        );
        res.status(200).json({message: "Instructor assigned" , batch});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.addStudents = async (req, res) => {
    try {
        const batch = await batchService.addStudents(
            req.params.id,
            req.body.studentIds
        );

        res.status(200).json({message: "Students added to batch" , batch});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.removeStudent = async (req, res) => {
    try {
        const result = await batchService.removeStudent(
            req.params.id,
            req.params.studentId
        );
        res.status(200).json(result);
    } catch (error) {
         res.status(400).json({ message: error.message });
    }
};

exports.removeStudent = async (req, res) => {
    try {
        const result = await batchService.removeStudent(
            req.params.id,
            req.params.studentId
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


exports.assignCourses = async (req, res) => {
    try {
        const batch = await batchService.assignCourses(
            req.params.id,
            req.body.courseIds
        );

        res.status(200).json({message: "Courses assigned to batch" , batch});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};