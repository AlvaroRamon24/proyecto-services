import { Schema, model } from 'mongoose';
const solicitudAcceptedSchema = new Schema({
    solicitudId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Solicitud'
    },

})
// este models ya esta creada y se llama solicitud 
// cuando pide un servicio cliente crea Solicitud 
//cuando rechaza trabajador crea Reject 