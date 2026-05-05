const Certificate = require("../model/Certificate.model");
const CertificateTemplate = require("../model/CertificateTemplate.model");
const CertificateDownloadLog = require("../model/CertificateDownloadLog.model");
const Student = require("../model/student.model");
const Course = require("../model/Course.model");
const { generateCertificateId } = require("../utils/generateCertificateId");
const { generateQRCode } = require("../utils/generateQR");
const { generateCertificatePDF } = require("../utils/generateCertificatePDF");
const { checkCourseCompletion } = require("./completionCheck.service");
const { sendInApp, sendEmail } = require("../utils/notification");





const generateCertificate = async (studentId, courseId, isManual = false, issuedBy = null) => {
 
  const existing = await Certificate.findOne({ student: studentId, course: courseId });
  if (existing) return existing;

  const student = await Student.findById(studentId);
  const course  = await Course.findById(courseId).populate("batch");
  if (!student || !course) throw new Error("Student or course not found");


  const template = await CertificateTemplate.findOne({
    $or: [{ program: course.program }, { isDefault: true }]
  });

  
  const certificateId        = generateCertificateId();
  const { qrBase64, verifyUrl } = await generateQRCode(certificateId);
  const shareUrl             = `${process.env.APP_URL}/certificates/${certificateId}`;

  
  const { fileUrl } = await generateCertificatePDF({
    studentName:       student.fullName || student.profile?.fullName,
    programName:       course.program   || "Professional Program",
    courseName:        course.title,
    completionDate:    new Date(),
    certificateId,
    qrBase64,
    signatoryName:     template?.signatoryName    || "Director",
    signatureImageUrl: template?.signatureImageUrl || null,
    logoUrl:           template?.logoUrl           || null,
    institutionName:   template?.institutionName   || "Ethnotech Academy",
  });

  
  const certificate = await Certificate.create({
    certificateId,
    student:          studentId,
    course:           courseId,
    template:         template?._id,
    studentName:      student.fullName || student.profile?.fullName,
    programName:      course.program   || "Professional Program",
    courseName:       course.title,
    completionDate:   new Date(),
    qrCodeBase64:     qrBase64,
    verifyUrl,
    pdfUrl:           fileUrl,
    shareUrl,
    isManuallyIssued: isManual,
    issuedBy,
  });


  await sendInApp(
    studentId,
    " Your Certificate is Ready!",
    `Congratulations! Your certificate for "${course.title}" is ready to download.`,
    "general",
    certificate._id
  );

  if (student.email) {
    await sendEmail(
      student.email,
      "🎓 Certificate Ready — Ethnotech Academy",
      `Congratulations ${student.fullName}! Your certificate for "${course.title}" is ready. Download it from your dashboard or view it here: ${shareUrl}`
    );
  }

  return certificate;
};


exports.triggerAutoGeneration = async (studentId, courseId) => {
  const { isComplete, reason } = await checkCourseCompletion(studentId, courseId);
  if (!isComplete) return { generated: false, reason };

  const certificate = await generateCertificate(studentId, courseId, false);
  return { generated: true, certificate };
};


exports.manualGenerate = async (studentId, courseId, adminId) => {
  const certificate = await generateCertificate(studentId, courseId, true, adminId);
  return certificate;
};


exports.downloadCertificate = async (certificateId, studentId, ipAddress, userAgent) => {
  const certificate = await Certificate.findOne({ certificateId });
  if (!certificate) throw new Error("Certificate not found");


  await CertificateDownloadLog.create({
    certificate: certificate._id,
    student:     studentId,
    ipAddress,
    userAgent,
  });

  return certificate;
};


exports.verifyCertificate = async (certificateId) => {
  const certificate = await Certificate.findOne({ certificateId })
    .select("certificateId studentName programName courseName completionDate isManuallyIssued createdAt");
  if (!certificate) throw new Error("Certificate not found or invalid");

  return {
    isValid:        true,
    certificateId:  certificate.certificateId,
    studentName:    certificate.studentName,
    programName:    certificate.programName,
    courseName:     certificate.courseName,
    completionDate: certificate.completionDate,
    issuedOn:       certificate.createdAt,
    issuedBy:       "Ethnotech Academy",
  };
};


exports.getStudentCertificates = async (studentId) => {
  return Certificate.find({ student: studentId })
    .populate("course", "title category")
    .sort({ createdAt: -1 });
};


exports.getAllCertificates = async (filters = {}) => {
  const query = {};
  if (filters.course)  query.course  = filters.course;
  if (filters.student) query.student = filters.student;

  return Certificate.find(query)
    .populate("student", "fullName email")
    .populate("course",  "title")
    .sort({ createdAt: -1 });
};


exports.getDownloadLogs = async (filters = {}) => {
  const query = {};
  if (filters.certificate) query.certificate = filters.certificate;
  if (filters.student)     query.student     = filters.student;

  return CertificateDownloadLog.find(query)
    .populate("student",     "fullName email")
    .populate("certificate", "certificateId courseName")
    .sort({ downloadedAt: -1 });
};