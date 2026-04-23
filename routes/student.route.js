
const express = require("express");
const router = express.Router();
const studentController = require("../controller/student.controller");
const {auth, protect , superAdminOnly} = require("../middlewares/auth.middleware");

router.post("/register", studentController.register);


router.post("/login", studentController.login);
router.post("/send-reset-otp", studentController.sendResetOtp);

router.post("/reset-password", studentController.resetPassword);

router.get("/me", auth, studentController.getProfile);
router.post("/create", auth, studentController.createProfile);
router.put("/update", auth, studentController.updateProfile);
router.delete("/delete", auth, studentController.deleteProfile);

router.get("/admin/students", protect , superAdminOnly, studentController.getAllStudents);
router.get("/admin/students/:id", protect , superAdminOnly, studentController.getStudentById);
router.put("/admin/students/:id", protect, superAdminOnly, studentController.adminUpdateProfile);
router.delete("/admin/students/:id", protect , superAdminOnly, studentController.adminDeleteProfile);


module.exports = router;


