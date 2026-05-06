const express = require("express");
const router = express.Router();
const notificationController = require("../controller/notification.controller");
const {auth} = require("../middlewares/auth.middleware");
const {protect , adminOrAbove} = require("../middlewares/auth.middleware");

router.get("/",              auth, notificationController.getNotifications);
router.get("/unread-count",  auth, notificationController.getUnreadCount);
router.get("/type/:type", auth , notificationController.getByType);
router.patch("/read-all",    auth, notificationController.markAllAsRead);
router.patch("/:id/read",    auth, notificationController.markAsRead);
router.delete("/all", auth , notificationController.deleteAllNotifications);
router.delete("/:id",        auth, notificationController.deleteNotification);

router.post("/send", protect , adminOrAbove , notificationController.sendNotification);

module.exports = router;