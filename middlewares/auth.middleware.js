const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const authHeader  = req.headers.authorization;

  if (!authHeader ) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(authHeader , process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};