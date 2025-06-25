import { Schema, model } from 'mongoose';

const employeeSchema = new Schema({
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
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
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
    price: {
        type: Number,
        default: 0,
    },
    services: {
        type: Schema.Types.Mixed,
        default: {}
    },
    descriptionService: {
        type: String,
        default: '',
    },
    coverage: {
        type: [String],
        default: []
    },
    qualifications: {
        type: Number,
        default: 0,
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
const Employee = model('Employee', employeeSchema);
export default Employee;