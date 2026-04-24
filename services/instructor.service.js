const Instructor = require("../model/Instructor.model");
const Admin = require("../model/Admin.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async ({email, password}) => {
    const instructor = await Admin.findOne({email, role: "Instructor"});
    if(!instructor || !instructor.isActive) throw new Error("Invalid credentiald");

    const isMatch = await bcrypt.compare(password , instructor.password);
    if(!isMatch) throw new Error("Invalid credentials");


    const token = jwt.sign(
        {id: instructor._id , role: "Instructor"},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );

    return {token , instructor};
};

exports.getProfile = async (id) => {
    const instructor = await Admin.findById(id).select("-password");
    if(!instructor) throw new Error("Instructor not found");
    return instructor;
};

exports.updateProfile = async (id, data) => {
    const updated = await Admin.findByIdAndUpdate(
        id,
        {$set: data},
        {new: true, runValidators: true}
    ).select("-password");

    if(!updated) throw new Error("Instructor not found");
    return updated;
};