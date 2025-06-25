import Customer from "../models/Customer.js";
//import bcrypt from "bcrypt";

export const getCustomerAll = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching customers" });
    }
}

export const getCustomerById = async (req, res) => {
    const { id } = req.params;
    try {
        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: "Error fetching customer" });
    }
}

export const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { name, lastName, password, phone, isActive, address, photo, district, city, document } = req.body;
    try {
        const customer = await Customer.findByIdAndUpdate(id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        customer.name = name || customer.name;
        customer.lastName = lastName || customer.lastName;
        customer.password = password || customer.password;
        customer.phone = phone || customer.phone;
        customer.isActive = isActive || customer.isActive;
        customer.address = address || customer.address;
        customer.photo = photo || customer.photo;
        customer.district = district || customer.district;
        customer.city = city || customer.city;
        customer.document = document || customer.document;
        await customer.save();
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: "Error updating customer" });
        console.error(error);
    }
}

export const deleteCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        const customer = await Customer.findByIdAndDelete(id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting customer" });
    }
}