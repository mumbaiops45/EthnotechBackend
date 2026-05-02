// const Instructor = require("../model/Instructor.model");
// const Admin = require("../model/Admin.model");
// const Course = require("../model/Course.model");
// const Batch = require("../model/Batch.model");
// const Progress = require("../model/Progress.model");
// const Assessment = require("../model/Assessment.model");
// const LiveSession = require("../model/LiveSession.model");
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// exports.login = async ({email, password}) => {
//     const instructor = await Admin.findOne({email, role: "Instructor"});
//     if(!instructor || !instructor.isActive) throw new Error("Invalid credentiald");

//     const isMatch = await bcrypt.compare(password , instructor.password);
//     if(!isMatch) throw new Error("Invalid credentials");


//     const token = jwt.sign(
//         {id: instructor._id , role: "Instructor"},
//         process.env.JWT_SECRET,
//         {expiresIn: "7d"}
//     );

//     return {token , instructor};
// };

// exports.getProfile = async (id) => {
//     const instructor = await Admin.findById(id).select("-password");
//     if(!instructor) throw new Error("Instructor not found");
//     return instructor;
// };

// exports.updateProfile = async (id, data) => {
//     const updated = await Admin.findByIdAndUpdate(
//         id,
//         {$set: data},
//         {new: true, runValidators: true}
//     ).select("-password");

//     if(!updated) throw new Error("Instructor not found");
//     return updated;
// };


// exports.getMyCourses = async (instructorId) => {
//     const courses = await Course.find({instructor: instructorId})
//     .populate("modules.lessons" , "title isMandatory duration")
//     .sort({createdAt: -1});

//     const coursesWithStats = await Promise.all(
//         courses.map(async (course) => {
//             const totalStudents = await Progress.countDocuments({course: course._id});
//             const totalLessions = course.modules?.flatMap(m => m.lessons).length || 0;
//             const totalmodules = course.modules?.length || 0;


//             return {
//                 ...course.toObject(),
//                 stats: {
//                     totalStudents,
//                     totalModules,
//                     totalLessons,
//                 }
//             };
//         })
//     );
//     return coursesWithStats;
// };

// exports.getMyBatches = async (instructorId) => {
//     const batches = await Batch.find({instructor: instructorId , isActive: true})
//     .populate("students" , "fullName email mobile")
//     .populate("courses", "title category program")
//     .sort({ createdAt: -1});

//     const batchesWithStats = await Promise.all(
//         batches.map(async (batch) => {
//             const progressRecords = await Progress.find({batch: batch._id});

//             const avgCompletion = progressRecords.length > 0 ? Math.round(
//                 progressRecords.reduce((sum, p) => sum + p.overallCompletion, 0)
//             / progressRecords.length
//             ) : 0;

//             const avgAttendance = progressRecords.length > 0 ? Math.round(
//                 progressRecords.reduce((sum , p) => sum + p.attendancePercent, 0)
//                 / pregressRecords.length
//             ) : 0;


//             return{
//                 ...batch.toObject(),
//                 stats: {
//                     totalStudents: batch.students.length,
//                     totalCourses: batch.courses.length,
//                     avgCompletion,
//                     avgAttendance,
//                 }
//             };
//         })
//     );

// };

// exports.getMyStudents = async (instructorId) => {
//     const batches = await Batch.find({instructor: instructorId})
//     .populate({
//         path: "students",
//         select: "fullName email mobile profile isVerified",
//     });

//     const studentMap = new Map();
//     batches.forEach(batch => {
//         batch.students.forEach(student => {
//             if (!studentMap.has(student._id.toString())){
//                 studentMap.set(student._id.toString() , {
//                     ...student.toObject(),
//                     batches: [{ id: batch._id , name: batch.name , branch: batch.branch}]
//                 });
//             } else {
//                 studentMap.get(student._id.toString()).batches.push({
//                     id: batch._id , name: batch.branch
//                 });
//             }
//         });
//     });

//     return Array.from(studentMap.values());
// };


// exports.getCourseStudents = async (instructorId , courseId) => {
//     const course = await Course.findOne({ _id: courseId , instructor: instructorId});
//     if  (!course) throw new Error("Course not found or not assigned to you");


//     const progressRecords = await Progress.find({course: courseId})
//     .populate("student", "fullName email mobile profile")
//     .populate("lessons.lesson", "title isMandatory");

//     return progressRecords.map(p => ({
//         student: p.student,
//         overallCompletion: p.overallCompletion,
//         attendancePercent: p.attendancePercent,
//         completedLessons: p.lessons.filter( l => l.isCompleted).length,
//         totalLessons: p.lessons.length,
//         lastUpdated: p.updatedAt,
//     }));
// };


// exports.getMyDashboard = async (instructorId) => {
//     const [totalCourses ,  totalBatches,
//     upcomingSessions,
//     batches,] = await Promise.all([
//     Course.countDocuments({ instructor: instructorId }),
//     Batch.countDocuments({ instructor: instructorId, isActive: true }),
//     LiveSession.find({
//       instructor: instructorId,
//       status:     "scheduled",
//       scheduledAt:{ $gte: new Date() },
//     })
//       .populate("batch", "name")
//       .sort({ scheduledAt: 1 })
//       .limit(5),
//     Batch.find({ instructor: instructorId }).select("students"),
//   ]);
//   const studentIds = new Set();
//   batches.forEach(b => b.students.forEach(s => studentIds.add(s.toString())));

//   return {
//     totalCourses,
//     totalBatches,
//     totalStudents:     studentIds.size,
//     upcomingSessions,
//     upcomingCount:     upcomingSessions.length,
//   };
// }



const Admin      = require("../model/Admin.model");
const Course     = require("../model/Course.model"); 
const Batch      = require("../model/Batch.model");
const Progress   = require("../model/Progress.model");
const Assessment = require("../model/Assessment.model");
const LiveSession= require("../model/LiveSession.model");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");

exports.login = async ({ email, password }) => {
  const instructor = await Admin.findOne({ email, role: "Instructor" });
  if (!instructor || !instructor.isActive) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, instructor.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: instructor._id, role: "Instructor" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return { token, instructor };
};

exports.getProfile = async (id) => {
  const instructor = await Admin.findById(id).select("-password");
  if (!instructor) throw new Error("Instructor not found");
  return instructor;
};

exports.updateProfile = async (id, data) => {
  delete data.role;
  delete data.password;

  const updated = await Admin.findByIdAndUpdate(
    id, { $set: data }, { new: true }
  ).select("-password");
  if (!updated) throw new Error("Instructor not found");
  return updated;
};

exports.getMyCourses = async (instructorId) => {
  const courses = await Course.find({ instructor: instructorId })
    .populate("modules.lessons", "title isMandatory duration")
    .sort({ createdAt: -1 });

  const coursesWithStats = await Promise.all(
    courses.map(async (course) => {
      const totalStudents = await Progress.countDocuments({ course: course._id });
      const totalLessons  = course.modules?.flatMap(m => m.lessons).length || 0; 
      const totalModules  = course.modules?.length || 0;                         

      return {
        ...course.toObject(),
        stats: {
          totalStudents,
          totalModules, 
          totalLessons,  
        }
      };
    })
  );
  return coursesWithStats;
};

exports.getMyBatches = async (instructorId) => {
  const batches = await Batch.find({ instructor: instructorId, isActive: true })
    .populate("students", "fullName email mobile")
    .populate("courses",  "title category program")
    .sort({ createdAt: -1 });

  const batchesWithStats = await Promise.all(
    batches.map(async (batch) => {
      const progressRecords = await Progress.find({ batch: batch._id });

      const avgCompletion = progressRecords.length > 0
        ? Math.round(
            progressRecords.reduce((sum, p) => sum + p.overallCompletion, 0)
            / progressRecords.length  
          )
        : 0;

      const avgAttendance = progressRecords.length > 0
        ? Math.round(
            progressRecords.reduce((sum, p) => sum + p.attendancePercent, 0)
            / progressRecords.length  
          )
        : 0;

      return {
        ...batch.toObject(),
        stats: {
          totalStudents: batch.students.length,
          totalCourses:  batch.courses.length,
          avgCompletion,
          avgAttendance,
        }
      };
    })
  );

  return batchesWithStats; 
};

exports.getMyStudents = async (instructorId) => {
  const batches = await Batch.find({ instructor: instructorId })
    .populate({
      path:   "students",
      select: "fullName email mobile profile isVerified",
    });

  const studentMap = new Map();
  batches.forEach(batch => {
    batch.students.forEach(student => {
      if (!studentMap.has(student._id.toString())) {
        studentMap.set(student._id.toString(), {
          ...student.toObject(),
          batches: [{ id: batch._id, name: batch.name, branch: batch.branch }]
        });
      } else {
        studentMap.get(student._id.toString()).batches.push({
          id: batch._id, name: batch.name, branch: batch.branch // ✅ fixed branch→name
        });
      }
    });
  });

  return Array.from(studentMap.values());
};

exports.getCourseStudents = async (instructorId, courseId) => {
  const course = await Course.findOne({ _id: courseId, instructor: instructorId });
  if (!course) throw new Error("Course not found or not assigned to you");

  const progressRecords = await Progress.find({ course: courseId })
    .populate("student",       "fullName email mobile profile")
    .populate("lessons.lesson","title isMandatory");

  return progressRecords.map(p => ({
    student:           p.student,
    overallCompletion: p.overallCompletion,
    attendancePercent: p.attendancePercent,
    completedLessons:  p.lessons.filter(l => l.isCompleted).length,
    totalLessons:      p.lessons.length,
    lastUpdated:       p.updatedAt,
  }));
};

exports.getMyDashboard = async (instructorId) => { 
  const [totalCourses, totalBatches, upcomingSessions, batches] =
    await Promise.all([
      Course.countDocuments({ instructor: instructorId }),
      Batch.countDocuments({ instructor: instructorId, isActive: true }),
      LiveSession.find({
        instructor:  instructorId,
        status:      "scheduled",
        scheduledAt: { $gte: new Date() },
      })
        .populate("batch", "name")
        .sort({ scheduledAt: 1 })
        .limit(5),
      Batch.find({ instructor: instructorId }).select("students"),
    ]);

  const studentIds = new Set();
  batches.forEach(b => b.students.forEach(s => studentIds.add(s.toString())));

  return {
    totalCourses,
    totalBatches,
    totalStudents:   studentIds.size,
    upcomingSessions,
    upcomingCount:   upcomingSessions.length,
  };
};