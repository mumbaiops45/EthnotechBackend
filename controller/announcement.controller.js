const announcementService = require("../services/announcement.service");


exports.sendAnnouncement = async (req, res) => {
  try {
    const result = await announcementService.sendAnnouncement(
      req.instructor._id, req.body
    );
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await announcementService.getAnnouncements(req.instructor._id);
        res.status(200).json(announcements);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.getAnnouncementById = async (req, res) => {
    try {
        const announcement = await announcementService.getAnnouncementById(req.params.id);
        res.status(200).json(announcement);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}