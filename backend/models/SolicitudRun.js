import { Schema, model} from 'mongoose'

const SolicitudRunSchema = new Schema({
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
    }
})
const SolicitudRun = model('SolicitudRun', SolicitudRunSchema)
export default SolicitudRun;