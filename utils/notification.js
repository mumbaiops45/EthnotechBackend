// Plug in real email/SMS/in-app service here
// For now logs are placeholders — replace with nodemailer, twilio, etc.
const Notification = require("../model/Notification.model");

exports.sendInApp = async (studentId, title, message, type = "general" , refId= null) => {
  await Notification.create({ student: studentId , title, message, type, refId});
}

exports.sendEmail = async (to, subject, body) => {
  console.log(`📧 EMAIL TO: ${to} | SUBJECT: ${subject} | BODY: ${body}`);
  // await nodemailer.sendMail({ to, subject, html: body });
};

exports.sendSMS = async (mobile, message) => {
  console.log(`📱 SMS TO: ${mobile} | MESSAGE: ${message}`);
  // await twilioClient.messages.create({ to: mobile, body: message });
};

exports.sendInApp = async (studentId, message) => {
  console.log(`🔔 IN-APP TO: ${studentId} | MESSAGE: ${message}`);
  // await Notification.create({ student: studentId, message });
};

exports.notifyStudents = async (students, title, message , type = "general" , refId = null ) => {
  for (const student of students) {
    await exports.sendInApp(student._id, title,  message , type , refId);
    if (student.email)  await exports.sendEmail(student.email, title, message);
    if (student.mobile) await exports.sendSMS(student.mobile, message);
  }
};