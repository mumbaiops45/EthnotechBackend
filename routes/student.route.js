
const express = require("express");
const router = express.Router();
const studentController = require("../controller/student.controller");


router.post("/register", studentController.register);


router.post("/login", studentController.login);


module.exports = router;


