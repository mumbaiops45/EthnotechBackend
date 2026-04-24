const jwt = require("jsonwebtoken");
// const Instructor = require("../model/Instructor.model");
const Admin = require("../model/Admin.model");

exports.instructorAuth = async (req, res, next) => {
    try {
       const token = req.headers.authorization?.split(" ")[1];
       if(!token) return res.status(401).json({message: "No token provided"});

       const decoded = jwt.verify(token , process.env.JWT_SECRET);
       if(decoded.role !== "Instructor")
        return res.status(403).json({message: "Access denied"});

       req.instructor = await Admin.findById(decoded.id).select("-password");
       if(!req.instructor || !req.instructor.isActive)
        return res.status(401).json({message: "Unauthorized"});

       next();
    } catch (error) {
        res.status(401).json({message: "Invalid token"});
    }
};
