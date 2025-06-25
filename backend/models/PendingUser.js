import { Schema, model } from 'mongoose';

const pendingUserSchema = new Schema({
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
    expiresAt: {
        type: Date,
        default: '',
    },
    token: {
        type: String,
        default: ''
    }
})
pendingUserSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PendingUser = model('PendingUser', pendingUserSchema);
export default PendingUser;