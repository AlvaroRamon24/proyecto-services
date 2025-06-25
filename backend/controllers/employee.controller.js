import Employee from "../models/Employee.js";
import Notifications from "../models/Solicitud.js";

export const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { name, lastName, password, address, photo, city,
        district, phone, isActive, document, price, services,
        descriptionService, coverage, qualifications } = req.body;
    try {
        const updateEmployee = await Employee.findByIdAndUpdate(id);
        if (!updateEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        updateEmployee.name = name || updateEmployee.name;
        updateEmployee.lastName = lastName || updateEmployee.lastName;
        updateEmployee.password = password || updateEmployee.password;
        updateEmployee.address = address || updateEmployee.address;
        updateEmployee.photo = photo || updateEmployee.photo;
        updateEmployee.city = city || updateEmployee.city;
        updateEmployee.district = district || updateEmployee.district;
        updateEmployee.document = document || updateEmployee.document;
        updateEmployee.price = price || updateEmployee.price;
        updateEmployee.services = services || updateEmployee.services;
        updateEmployee.descriptionService = descriptionService || updateEmployee.descriptionService;
        updateEmployee.coverage = coverage || updateEmployee.coverage;
        updateEmployee.qualifications = qualifications || updateEmployee.qualifications;
        updateEmployee.phone = phone || updateEmployee.phone;
        updateEmployee.isActive = isActive || updateEmployee.isActive;
        await updateEmployee.save();
        res.status(200).json(updateEmployee);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await Employee.findByIdAndDelete(id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

