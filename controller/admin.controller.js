const adminService = require("../services/admin.service");

const login = async (req, res) => {
    try {
        const {email, password } = req.body;
        const result = await adminService.loginAdmin(email, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

const createAdmin = async(req, res) => {
    try {
        const admin = await adminService.createAdmin(req.body, req.admin._id);
        res.status(201).json({message: "Admin created", admin});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


const getAllAdmins = async (req, res) => {
    try {
        const {role, isActive} = req.query;
        const filters = {
            role, 
            isActive: isActive !== undefined ? isActive === "true" : undefined,
        };

        const admins = await adminService.getAllAdmins(req.admin, filters);
        res.status(200).json(admins);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

const getAdminById = async (req, res) => {
    try {
        const admin = await adminService.getAdminById(req.params.id);
        res.status(200).json(admin);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
};

const updateAdmin = async (req, res) => {
    try {
        const updated = await adminService.updateAdmin(req.params.id , req.body , req.admin);
        res.status(200).json({message: "Admin updated", admin: updated});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


const deactivateAdmin = async (req, res) => {
    try {
        const result = await adminService.deactivateAdmin(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


const deleteAdmin = async (req, res) => {
    try {
        const result = await adminService.deleteAdmin(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};


module.exports = {
    login,
    createAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deactivateAdmin,
    deleteAdmin,
};