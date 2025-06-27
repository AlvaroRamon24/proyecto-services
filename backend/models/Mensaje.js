import { Schema, model } from 'mongoose';

const mensajeSchema = new Schema({
  roomId: { type: String, required: true },
  customerId: { type: String, required: true },
  employeeId: { type: String, required: true },
  de: { type: String, required: true }, // quién envía
  nombre: { type: String, required: true }, // nombre del emisor
  texto: { type: String, required: true },
  hora: { type: String, required: true },
}, {
  timestamps: true
});

const Mensaje = model('Mensaje', mensajeSchema);
export default Mensaje;