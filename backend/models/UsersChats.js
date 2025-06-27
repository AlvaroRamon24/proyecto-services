import { Schema, model } from 'mongoose';

const UsersSchema = new Schema({
    roomId: {
        type: String,
        required: true,
    },
    usuarioId: {
        type: String,
        required: true,
    },
    destinatario: {
        type: String,
        required: true,
    },
    fotoUrl: {
        type: String,
        required: true,
    },
})
const UsersChats = model('UsersChats', UsersSchema);
export default UsersChats;