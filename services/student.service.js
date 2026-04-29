const Student = require("../model/student.model");
const {generateOTP} = require(".././utils/otp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (data) => {
  const { email, password, mobile } = data;

  const existingStudent = await Student.findOne({ email });
  if (existingStudent) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const student = await Student.create({
    email,
    mobile,
    password: hashedPassword,
      role: "Student",
  });

  return student;
};


exports.loginUser = async (data) => {
  const { email, password } = data;

  const student = await Student.findOne({ email });
  if (!student) {
    throw new Error("Student not found");
  }

  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: student._id, email: student.email ,  role: student.role  },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { student, token };
};


exports.sendResetOtp = async (data) => {
  const {email} = data;

  const student = await Student.findOne({ email });
  if (!student) {
    throw new Error("Student not found");
  }

  const otp = "123456";

  student.otp = {
    code: otp,
  };

  await student.save();

  return { message: "OTP sent successfully (hardcoded 123456)" };

}


exports.resetPassword = async (data) => {
  const { email, otp, newPassword } = data;

  const student = await Student.findOne({ email });
  if (!student) {
    throw new Error("Student not found");
  }

  if (!student.otp || student.otp.code !== otp) {
    throw new Error("Invalid OTP");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  student.password = hashedPassword;

  
  student.otp = undefined;

  await student.save();

  return { message: "Password reset successful" };
};

exports.getProfile = async(userId) => {
  const student = await Student.findById(userId).select("profile");

  if (!student) throw new Error("Student not found");

  return student.profile;
};

exports.createProfile = async (userId , data) => {
  const student = await Student.findById(userId);

  if(!student) throw new Error("Student not found");

  if(student.profile && student.profile.fullName){
        throw new Error("Profile already exists. Use update API");
  }

  student.profile = data;
  await student.save();

  return student.profile
}

exports.updateProfile = async (userId, data) => {
  const student = await Student.findById(userId);

  if(!student) throw new Error("Student not found");

  if(!student.profile){
    throw new Error("Profile not found. Create profile first");
  }

  Object.keys(data).forEach((key) => {
    student.profile[key] = data[key];
  });

  await student.save();

  return student.profile;
}

// aletrnative way

// exports.deleteProfile = async (userId) => {
//   const student = await Student.findById(userId);

//   if (!student) throw new Error("Student not found");

//   student.profile = undefined;

//   await student.save();

//   return { message: "Profile deleted successfully" };
// };


exports.deleteProfile = async (userId) => {
  const student = await Student.findByIdAndUpdate(
    userId,
    {$unset: {profile: ""}},
    {new: true}
  );
}



exports.getAllStudents = async () => {
  const students = await Student.find({}).select("-password -otp");
  return students;
}

exports.getStudentById = async (studentId) => {
  const student = await Student.findById(studentId).select("-password -otp");
  if(!student) throw new Error("Student not found");
  return student;
}

exports.adminUpdateProfile = async (studentId , data) => {
  const student = await Student.findById(studentId).select("-password -otp");
  if(!student) throw new Error("Student not found");

  const profileUpdate = {};
  Object.keys(data).forEach((key) => {
    profileUpdate[`profile.${key}`] = data[key];
  });

  const updated = await Student.findByIdAndUpdate(
    studentId,
    {$set: profileUpdate},
    {new: true, runValidators: true}
  ).select("-password -otp");

  return updated.profile;
 
};


exports.adminDeleteProfile = async (studentId) => {
  const student = await Student.findByIdAndUpdate(
    studentId, 
    {$unset: {profile: ""}},
    {new: true}
  );
  if(!student) throw new Error("Student not found");

  return {message: "Student profile deleted successfully bu SuperAdmin"};
};


