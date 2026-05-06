const Notification = require("../model/Notification.model");
const mongoose = require("mongoose");

exports.getNotifications = async (studentId, page = 1, limit = 20) => {
  if(!mongoose.Types.ObjectId.isValid(studentId))
    throw new Error("Invalid student ID");
  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ student: studentId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments({ student: studentId }),
    Notification.countDocuments({ student: studentId, isRead: false }),
  ]);

  return {
    notifications,
    unreadCount,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

exports.getUnreadCount = async (studentId) => {
  const count = await Notification.countDocuments({
    student: studentId,
    isRead: false,
  });
  return {unreadCount: count};
};

exports.markAsRead = async (studentId, notificationId) => {
  if (!mongoose.Types.ObjectId.isValid(notificationId))
    throw new Error("Invalid notification ID");
 const notif =  await Notification.findOneAndUpdate(
    { _id: notificationId, student: studentId },
    { $set: { isRead: true } },
    {new: true}
  );

  if (!notif) throw new Error("Notification not found");
  return { message: "Marked as read", notification: notif };
};

exports.markAllAsRead = async (studentId) => {
 const result =  await Notification.updateMany(
    { student: studentId, isRead: false },
    { $set: { isRead: true } }
  );
  return { message: "All notifications marked as read",
    updated: result.modifiedCount,
   };
};

exports.deleteNotification = async (studentId, notificationId) => {
  if (!mongoose.Types.ObjectId.isValid(notificationId))
    throw new Error("Invalid notification ID");
  const notif =  await Notification.findOneAndDelete({
    _id: notificationId, student: studentId
  });
  if (!notif) throw new Error("Notification not found");
  return { message: "Notification deleted" };
};

exports.deleteNotification = async (studentId) => {
  const result = await Notification.deleteMany({ student: studentId});
  return {
    message: "All notifications deleted",
    deleted: result.deletedCount,
  };
};

exports.getByType = async (studentId , type) => {
  return Notification.find({student: studentId , type})
  .sort({createdAt: -1});
};

exports.createNotification = async ({studentId , title , message , type , refId}) => {
  if (!mongoose.Types.ObjectId.isValid(studentId))
    throw new Error("Invalid student ID");

  const notif = await Notification.create({
    student: new mongoose.Types.ObjectId(studentId),
    title,
    message,
    type: type || "general",
    refId: refId || undefined,
    isRead: false,
  });

  return notif;
};