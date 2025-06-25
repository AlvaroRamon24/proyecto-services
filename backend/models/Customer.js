import { Schema, model } from 'mongoose';
const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        trim: true,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    document: {
        type: String,
        default: '',
    },
    address: {
        type: String,
        default: '',
    },
    photo: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        default: '',
    },
    district: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    qualifications: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    resetToken: {
        type: String,
        default: null,
    },
    resetTokenExpiration: {
        type: Date,
        default: null,
    }
});

const Customer = model('Customer', userSchema);
export default Customer;