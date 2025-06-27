import { Schema, model } from 'mongoose';

const mensajeSchema = new Schema({
  roomId: { type: String, required: true },
  de: { type: String, required: true },
  texto: { type: String, required: true },
  hora: { type: String, required: true }, 
});
const Mensaje = model('Mensaje', mensajeSchema);

export default Mensaje;
