
const express = require("express");
const router = express.Router();
const studentController = require("../controller/student.controller");
const {auth} = require("../middlewares/auth.middleware");


router.post("/register", studentController.register);


router.post("/login", studentController.login);
router.post("/send-reset-otp", studentController.sendResetOtp);

router.post("/reset-password", studentController.resetPassword);

router.get("/me", auth, studentController.getProfile);
router.post("/create", auth, studentController.createProfile);
router.put("/update", auth, studentController.updateProfile);
router.delete("/delete", auth, studentController.deleteProfile);



module.exports = router;


