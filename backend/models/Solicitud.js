import { model, Schema } from 'mongoose';

const solicitudSchema = new Schema({
    customerId: { 
        type: String,
        required: true,
    },
    employeeId: { 
        type: String, 
        required: true 
    },
    service: { 
        type: String, 
        required: true 
    },
    comment: { 
        type: String 
    },
    status: { 
        type: String, 
        default: 'pending' 
    }, // pending, read, responded
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});
const solicitud = model('Solicitud', solicitudSchema);
export default solicitud;