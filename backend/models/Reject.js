import { model, Schema } from 'mongoose';

const rejectSchema = new Schema({
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
        default: 'responded' 
    }, // pending, read, responded
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});
const Reject = model('Reject', rejectSchema);
export default Reject;