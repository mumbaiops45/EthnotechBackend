const express = require("express");
const router = express.Router();
const templateController = require("../controller/certifucateTemplete.comtroller");
const {protect , superAdminOnly , adminOrAbove} = require("../middlewares/auth.middleware");



router.post("/",    protect, adminOrAbove,   templateController.createTemplate);
router.get("/",     protect, adminOrAbove,   templateController.getTemplates);
router.put("/:id",  protect, superAdminOnly, templateController.updateTemplate);
router.delete("/:id", protect, superAdminOnly, templateController.deleteTemplate);

module.exports = router;