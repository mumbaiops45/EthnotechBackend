const jwt = require("jsonwebtoken");
const Admin = require("../model/Admin.model");
const Student = require("../model/student.model");

const auth = (req, res, next) => {
  const authHeader  = req.headers.authorization;

  if (!authHeader ) return res.status(401).json({ message: "No token" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token , process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};


const protect = async (req, res, next) =>{
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({message: "No token Provided"});

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select("-password");

    if(!req.admin || !req.admin.isActive)
      return res.status(401).json({message: "Unauthorized or inactive account"});

    next();
  } catch (error) {
    res.status(401).json({message: "Invalid token"});
  }
};


const superAdminOnly = (req, res, next) =>{
  if(req.admin.role !== "SuperAdmin")
    return res.status(403).json({message: "Access denied: SuperAdmin only"});

  next();
};

const adminOrAbove = (req, res, next) => {
  if (!["SuperAdmin", "BranchAdmin"].includes(req.admin.role))
    return res.status(403).json({message: "Access denied"});
  next();
}

module.exports = {auth, protect , superAdminOnly , adminOrAbove};





