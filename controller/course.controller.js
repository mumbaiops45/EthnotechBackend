const courseService = require("../services/course.service");



exports.getCourse = async(req, res) => {
    try {
        const instructorId = req.instructor.id;
        const course = await courseService.getCourses(instructorId);
        res.status(200).json(course);
    } catch (error) {
        res.status(404).json({message:error.message});
    }
}

exports.createCourse = async (req, res) => {
    try {
        const instructorId = req.instructor.id;
        const course = await courseService.createCourse(instructorId , req.body);
        res.status(200).json(course);
    } catch (error) {
        res.status(404).json({message:error.message});
    }
}

exports.getCourseById = async (req, res) => {
    try {
        const course = await courseService.getCourseById(
            req.params.id,
            req.instructor.id
        );
        res.status(200).json(course);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

exports.updateCourse = async(req, res) => {
    try {
        const course = await courseService.updateCourse(req.params.id  , req.body);
        res.status(200).json({message: "Course updated", course});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}


exports.deleteCourse = async(req, res) => {
    try {
        const result = await courseService.deleteCourse(req.params.id );
     res.status(200).json({message: "Course Delete",  result});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


exports.addModule = async (req, res) => {
    try {
        const course = await courseService.addModule(
            req.params.id,
            req.body
        );
        res.status(200).json({message: "Module added Successfully" , course});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

exports.reorderModule = async(req, res) => {
    try {
        const course = await courseService.reorderModules(req.params.id , req.body.orderIds);
        res.status(200).json({message: "Reorder Module Order Successfully"});
    } catch (error) {
        res.status(400).json({message: error.mesage})
    }
}