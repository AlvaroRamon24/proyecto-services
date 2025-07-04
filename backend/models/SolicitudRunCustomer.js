import { Schema, model} from 'mongoose'

const SolicitudRunCustomerSchema = new Schema({
    customerId: {
        type: String,
        trim: true,
        default: ''
    },
    employeeId: {
        type: String,
        trim: true,
        default: ''
    },
    name: {
        type: String,
        trim: true,
        default: ''
    },
    photo: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: false
    }
})
const SolicitudRunCustomer = model('SolicitudRunCustomer', SolicitudRunCustomerSchema)
export default SolicitudRunCustomer;