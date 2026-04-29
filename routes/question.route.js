const express = require("express");
const router = express.Router();
const questionController = require("../controller/question.controller");
const {instructorAuth} = require("../middlewares/instructor.middleware");


router.post("/",          instructorAuth, questionController.createQuestion);
router.get("/",           instructorAuth, questionController.getQuestions);
router.get("/:id",        instructorAuth, questionController.getQuestionById);
router.put("/:id",        instructorAuth, questionController.updateQuestion);
router.delete("/:id",     instructorAuth, questionController.deleteQuestion);
router.get("/random/pull",instructorAuth, questionController.getRandomQuestions);

module.exports = router;