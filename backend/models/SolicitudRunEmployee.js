import { Schema, model} from 'mongoose'

const SolicitudRunEmployeeSchema = new Schema({
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
const SolicitudRunEmployee = model('SolicitudRunEmployee', SolicitudRunEmployeeSchema)
export default SolicitudRunEmployee;