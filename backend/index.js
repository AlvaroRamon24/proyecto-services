import app from './src/app.js';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { setSocketIO } from './controllers/solicitud.controller.js';
import { registerSocketEvents } from './socket.js';
dotenv.config();

// Crear servidor HTTP
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  }
});
global.connectedEmployees = {};
global.connectedCustomers = {};
registerSocketEvents(io);
setSocketIO(io);

// Escuchar el servidor (Express + WebSocket)
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Servidor Express y WebSocket activo en http://localhost:${PORT}`);
});
