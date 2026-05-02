const express = require("express");
const router = express.Router();
const batchController = require("../controller/batch.controller");
const {protect , superAdminOnly , adminOrAbove} = require("../middlewares/auth.middleware");

router.post("/", protect , adminOrAbove , batchController.createBatch);
router.get("/", protect , adminOrAbove , batchController.getAllBatches);
// router.get("/",  batchController.getAllBatches);
router.get("/:id", protect , adminOrAbove , batchController.getBatchById);
router.put("/:id",  protect , adminOrAbove, batchController.updateBatch);
router.delete("/:id", protect , superAdminOnly, batchController.deleteBatch);

// GET http://localhost:8080/batches?branch=Mumbai
// GET http://localhost:8080/batches?program=B.Tech Computer Science
// GET http://localhost:8080/batches?isActive=true

router.put("/:id/assign-instructor", protect , superAdminOnly , batchController.assignInstructor);

router.put("/:id/add-students", protect , adminOrAbove, batchController.addStudents);
router.delete("/:id/students/:studentId", protect,adminOrAbove, batchController.removeStudent);


router.put("/:id/assign-courses" , protect, adminOrAbove , batchController.assignCourses);

module.exports = router;