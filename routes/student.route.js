
const express = require("express");
const router = express.Router();
const studentController = require("../controller/student.controller");


router.post("/register", studentController.register);


router.post("/login", studentController.login);
router.post("/send-reset-otp", studentController.sendResetOtp);

router.post("/reset-password", studentController.resetPassword);


module.exports = router;


