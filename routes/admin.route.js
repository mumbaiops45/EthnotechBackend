const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin.controller");
const {protect , superAdminOnly , adminOrAbove} = require("../middlewares/auth.middleware");


router.post("/login", adminController.login);
router.post("/", protect , superAdminOnly, adminController.createAdmin);
router.delete("/:id", protect, superAdminOnly,adminController.deleteAdmin);
router.patch("/:id/deactivate", protect, superAdminOnly , adminController.deactivateAdmin);

// SuperAdmin + BranchAdmin
router.get("/", protect, adminOrAbove , adminController.getAllAdmins);
router.get("/:id", protect , adminOrAbove , adminController.getAdminById);
router.put("/:id", protect, adminOrAbove, adminController.updateAdmin);

module.exports = router;