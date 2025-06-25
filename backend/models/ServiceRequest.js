import { Schema, model } from 'mongoose';

const serviceRequestSchema = new Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pendiente', 'aceptado', 'rechazado'],
        default: 'pendiente'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const ServiceRequest = model('ServiceRequest', serviceRequestSchema);
export default ServiceRequest;