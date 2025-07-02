import { Schema, model} from 'mongoose'

const ReviewSchema = new Schema({
    customerId: { type: Schema.Types.ObjectId },
    employeeId: { type: Schema.Types.ObjectId },
    comentario: {type: String,trim: true,default: ''},
    calificacion: {type: String,default: ''},
    hoverRating: {type: String,default: ''},
    date: {
        type: Date,
        default: Date.now,
      },
})
const Review = model('Review', ReviewSchema)
export default Review;

