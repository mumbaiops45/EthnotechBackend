const instructorService  = require("../services/instructor.service");


exports.login = async(req , res) => {
    try {
        const result = await instructorService.login(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


exports.getProfile = async (req, res ) => {
    try {
        const profile = await instructorService.getProfile(req.instructor.id);
        res.status(200).json(profile);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const profile = await instructorService.updateProfile(req.instructor.id , req.body);
        res.status(200).json({message: "Profile updated", profile});
    } catch (error){
        res.status(400).json({message: error.message});
    }
}