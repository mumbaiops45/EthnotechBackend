const cron = require("node-cron");
const LiveSession = require("../model/LiveSession.model");
const Batch = require("../model/Batch.model");
const {notifyStudents} = require("../utils/notification");



const runReminderJob = () => {
    cron.schedule(" * * * * *", async () => {
        const now = new Date();

        const in24hr = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const window24start = new Date(in24hr.getTime() - 60 * 1000);
        const window24end = new Date(in24hr.getTime() + 60 * 1000);

        const sessions24 = await LiveSession.find({
            scheduledAt: {$gte: window24start , $lte: window24end},
            status: "scheduled",
            remainer24Sent : false,
        });

        for (const session of sessions24) {
            const batch = await Batch.findById(session.batch)
            .populate("students", "fullName email mobile");

            if(batch?.students?.length > 0){
                const title =  ` Live Class Tomorrow: ${session.title}`;
                const message = `Reminder: "${session.topic}" is scheduled tomorrow at ${new Date(session.scheduledAt).toLocaleString()}. Duration: ${session.duration} mins. Join: ${session.joinLink}`;
                await notifyStudents(batch.students, title, message, "live_class", session._id);
            }

            session.reminder24Send = true;
            await session.save();
            console.log(` 24hr reminder sent for: ${session.title}`);
        }


        const in15min = new Date(now.getTime() + 15 * 60 * 1000);
        const window15start = new Date(in15min.getTime() - 60 * 1000);
        const window15end = new Date(in15min.getTime() + 60 *1000);

        const sessions15 = await LiveSession.find({
            scheduledAt: { $gte: window15start, $lte: window15end  },
            status: "scheduled",
            remainer15Send: false,
        });

        for (const session of sessions15){
            const batch = await Batch.findById(session.batch)
            .populate("students", "fullName email mobile");

            if (batch?.students?.length > 0){
                const title = ` Live Class Starting in 15 mins: ${session.title}`;
                const message = `"${session.topic}" starts in 15 minutes! Join now: ${session.joinLink}`;
        await notifyStudents(batch.students, title, message, "live_class", session._id);
            }

            session.reminder15Sent = true;
      await session.save();
      console.log(`15min reminder sent for: ${session.title}`);
        }
    });

    console.log("⏱️  Reminder cron job started");
};


module.exports = { runReminderJob };
