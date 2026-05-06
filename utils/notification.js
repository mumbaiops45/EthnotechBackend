const  mongoose  = require("mongoose");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const Notification = require("../model/Notification.model");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN
);


exports.sendInApp = async (studentId , title , message , type = "general", refId = null) => {
  try {

      if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      console.error(" sendInApp: Invalid studentId:", studentId);
      return;
    }

    await Notification.create({
      student: studentId,
      title,
      message,
      type,
      refId: refId && mongoose.Types.ObjectId.isValid(refId) 
      ? new mongoose.Types.ObjectId(refId) : undefined,
    });
    console.log(`IN-APP saved for student: ${studentId} | ${title}`);

  } catch (error) {
    console.error("Notification save error:", error.message);
  }
}

exports.sendEmail = async (to , subject, body) => {
  try {
     if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`📧 EMAIL SKIPPED (not configured) → ${to} | ${subject}`);
      return;
    }

    await transporter.sendMail({
      from: `"NNC Mumabi" <${process.env.EMAIL_USER}>`,
      to,
      subject ,
      html: body,
    });

    console.log(`EMAIL sent ${to} | ${subject}`);
  } catch (error) {
    console.log("sendEmail error: ", error.message);
  }
};

exports.sendSMS = async (mobile, message) => {
  try {
    if (!process.env.TWILIO_SID || !process.env.TWILIO_TOKEN || !process.env.TWILIO_FROM) {
      console.log(` SMS SKIPPED (not configured) → ${mobile} | ${message}`);
      return;
    }
      await twilioClient.messages.create({
      to:   mobile,
      from: process.env.TWILIO_FROM,
      body: message,
    });

    console.log(` SMS sent → ${mobile}`);
  } catch (error) {
    console.error(" sendSMS error:", error.message);
  }
}


exports.notifyStudents = async (students, title, message , type = "general" , refId = null ) => {
  for (const student of students) {
     const id = student._id || student;
    await exports.sendInApp(id, title,  message , type , refId);
    if (student.email)  await exports.sendEmail(student.email, title, message);
    if (student.mobile) await exports.sendSMS(student.mobile, message);
  }
};


exports.notifyOne = async (studentId , title , message , type = "general", refId = null) => {
  await exports.sendInApp(studentId , title , message , type, refId);
};