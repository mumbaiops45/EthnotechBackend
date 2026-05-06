// const notificationService = require("../services/notification.service");


// exports.getNotifications = async (req, res) => {
//   try {
//     const { page, limit } = req.query;
//     const result = await notificationService.getNotifications(
//       req.user.id, parseInt(page) || 1, parseInt(limit) || 20
//     );
//     res.status(200).json(result);
//   } catch (err) { res.status(400).json({ message: err.message }); }
// };


// exports.markAsRead = async (req, res) => {
//   try {
//     const result = await notificationService.markAsRead(
//       req.user.id, req.params.id
//     );
//     res.status(200).json(result);
//   } catch (err) { res.status(400).json({ message: err.message }); }
// };


// exports.markAllAsRead = async (req, res) => {
//   try {
//     const result = await notificationService.markAllAsRead(req.user.id);
//     res.status(200).json(result);
//   } catch (err) { res.status(400).json({ message: err.message }); }
// };


// exports.deleteNotification = async (req, res) => {
//   try {
//     const result = await notificationService.deleteNotification(
//       req.user.id, req.params.id
//     );
//     res.status(200).json(result);
//   } catch (err) { res.status(400).json({ message: err.message }); }
// };

// exports.getUnreadCount = async (req, res) => {
//   try {
//     const result = await notificationService.getUnreadCount(req.user.id);
//     res.status(200).json(result);
//   } catch (err) { res.status(400).json({ message: err.message }); }
// };

const notificationService = require("../services/notification.service");

exports.getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await notificationService.getNotifications(req.user.id , page , limit);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: err.message });
  }
}


exports.getUnreadCount = async (req, res) => {
  try {
    const result = await notificationService.getUnreadCount(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: err.message });
  }
};

exports.getByType = async (req, res) => {
  try {
    const notifications = await notificationService.getByType(req.user.id , req.params.type);
    res.status(200).json(notificationService);
  } catch (error) {
    res.status(400).json({ message: err.message });
  }
};

exports.markAsRead = async (req , res) => {
  try {
    const result = await notificationService.markAsRead(req.user.id , req.params.id);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: err.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const result = await notificationService.markAllAsRead(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const result = await notificationService.deleteNotification(req.user.id , req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

exports.deleteAllNotifications = async (req, res) => {
  try {
    const result = await notificationService.deleteAllNotifications(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

exports.sendNotification = async (req, res) => {
  try {
    const {studentId , title , message , type , redId} = req.body;

    if (!studentId || !title || !message)
      return res.status(400).json({message: "studentId , title and message are required"});

    const notif = await notificationService.createNotification({
      studentId , title , message , type , refId
    });

    res.status(201).json({message: "Notification sent", notif});
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};


