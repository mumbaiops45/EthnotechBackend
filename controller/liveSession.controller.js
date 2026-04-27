const liveSessionService = require("../services/liveSession.service");

exports.scheduleSession = async (req, res) => {
    try {
        const session = await liveSessionService.scheduleSession(
            req.instructor._id , 
            req.body
        );
        res.status(201).json({mesage: "Session scheduled and students notified", session});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}


exports.getSessions = async (req, res ) => {
    try {
        const sessions = await liveSessionService.getSessions(req.instructor._id);
        res.status(200).json(sessions);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


exports.getSessionById = async (req, res) => {
    try {
        const session = await liveSessionService.getSessionById(req.params.id);
        res.status(200).json(session);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
};


exports.updateSession = async (req, res) => {
    try {
        const session = await liveSessionService.updateSession(
            req.params.id , req.instructor._id , req.body
        );
        res.status(200).json({message: "Session updated", session});
    } catch (error) {
        res.status(404).json({message: error.message});
    }
};


exports.cancelSession = async (req, res) => {
    try {
        const result = await liveSessionService.cancelSession(req.params.id , req.instructor._id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.getCalendar = async (req, res) => {
  try {
    const { month, year } = req.query;
    const sessions = await liveSessionService.getCalendar(
      req.instructor._id, parseInt(month), parseInt(year)
    );
    res.status(200).json(sessions);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};