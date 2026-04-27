const Admin = require("../model/Admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");




const seedSuperAdmin = async () => {
    const exists = await Admin.findOne({role: "SuperAdmin"});

    if(!exists){
        const hashed = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10);
        await Admin.create({
            fullName: "Super Admin",
            email: process.env.SUPER_ADMIN_EMAIL,
            password: hashed,
            role: "SuperAdmin",
        });
        console.log("SuperAdmin seeded");
    }
};


const loginAdmin = async (email , password) => {
    const admin = await Admin.findOne({email});
    if (!admin) throw new Error("Invalid email or password");
    if(!admin.isActive) throw new Error("Account is deactived");

    const isMatch = await bcrypt.compare(password , admin.password);
    if(!isMatch) throw new Error("Invalid email or password");

    const token = jwt.sign(
        {id: admin._id , role: admin.role},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );

    return {
        token , 
        admin:{
            id: admin._id,
            fullName: admin.fullName,
            email: admin.email,
            role: admin.role,
            branch: admin.branch,
        },
    };
};

const createAdmin = async (data, createdBy) => {
    const {fullName , email, mobile , password , role,gender, branch} = data;

    if(role === "SuperAdmin") throw new Error("Cannot create another SuperAdmin");

    const exists = await Admin.findOne({email});
    if(exists) throw new Error("Email already is use");

    const hashed = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
        fullName, 
        email,
        mobile,
        password: hashed,
        role,
        gender,
        branch ,
        createdBy,
    });

    const {password: _, ...adminData} = newAdmin.toObject();

    return adminData;
};


const getAllAdmins = async (requestingAdmin, filters = {}) => {
    const query = {role: { $ne: "SuperAdmin"}};

    if(requestingAdmin.role === "BranchAdmin"){
        query.branch = requestingAdmin.branch;
    }

    if (filters.role) query.role = filters.role;
    if(filters.isActive !== undefined) query.isActive = filters.isActive;

    return Admin.find(query).select("-password").populate("createdBy", "fullName email");
};

const getAdminById = async (id) => {
    const admin = await Admin.findById(id).select("-password");
    if(!admin) throw new Error("Admin not found");
    return admin;
}

const updateAdmin = async (id, updates, requestingAdmin) => {
    const admin = await Admin.findById(id);
    if(!admin) throw new Error("Admin not found");

    if(
        requestingAdmin.role === "BranchAdmin" && 
        admin.branch !== requestingAdmin.branch
    ) throw new Error("Access denied: different branch");

    if(updates.role === "SuperAdmin") throw new Error("Cannot assign SuperAdmin role");

    if(updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(id, {$set: updates} , {new: true} ).select("-password");
    return updatedAdmin;
};


const deactivateAdmin = async (id) => {
    const admin = await Admin.findById(id);
    if(!admin) throw new Error("Admin not found");
    if(admin.role === "SuperAdmin") throw new Error("Cannot deactivate SuperAdmin");

    admin.isActive = false;
    await admin.save();
    return {message: "Admin deactivated successfully"};
}

// Hard Delete
const deleteAdmin = async(id) =>{
    const admin = await Admin.findById(id);
    if(!admin) throw new Erro("Admin not found");
    if(admin.role === "SuperAdmin") throw new Error("Cannot delete SuperAdmin");

    await Admin.findByIdAndDelete(id);
    return {message: "Admin deleted successfully"};
};

module.exports = {
    seedSuperAdmin,
    loginAdmin,
    createAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deactivateAdmin,
    deleteAdmin,
};