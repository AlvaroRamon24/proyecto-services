export function registerSocketEvents(io) {
    io.on('connection', (socket) => {
        console.log('Cliente conectado:', socket.id);

        socket.on('register_employee', (employeeId) => {
            global.connectedEmployees[employeeId] = socket.id;
        });
        socket.on('register_customer', (customerId) => {
            global.connectedCustomers[customerId] = socket.id;
        });

        //--------- 1. Unirse a una sala de chat
        socket.on('join_chat', ({ customerId, employeeId, isInitiator }) => {
            const roomId = [customerId, employeeId].sort().join('_');
            socket.join(roomId);
            console.log(`Usuario unido al room: ${roomId}`);

            // Solo emitir si es el que inicia (employee)
            if (isInitiator) {
                const employeeSocketId = global.connectedEmployees[employeeId];
                const customerSocketId = global.connectedCustomers[customerId];

                if (employeeSocketId) {
                    io.to(employeeSocketId).emit('chat_iniciado', { roomId, customerId, employeeId });
                }
                if (customerSocketId) {
                    io.to(customerSocketId).emit('chat_iniciado', { roomId, customerId, employeeId });
                }
            }
        });

        socket.on('enviar_mensaje', ({ roomId, mensaje }) => {
            console.log(`Mensaje recibido en ${roomId}:`, mensaje);
            io.to(roomId).emit('nuevo_mensaje', roomId, mensaje);
        });

        socket.on('typing', ({ roomId, nombre }) => {
            socket.to(roomId).emit('usuarioEscribiendo', nombre);
        });

        socket.on('stopTyping', ({ roomId }) => {
            socket.to(roomId).emit('usuarioParoDeEscribir');
        });
        
        socket.on('servicio_en_curso', ({ customerId, employeeId, roomId }) => {
            console.log("Backend recibió servicio_en_curso:", { customerId, employeeId, roomId });
            io.to(roomId).emit('mostrar_servicio_en_proceso', { customerId, employeeId, roomId });
        })
        //disconet socket
        socket.on('disconnect', () => {
            console.log('usuario desconectado', socket.id)
            for (const [id, sockId] of Object.entries(global.connectedEmployees)) {
                if (sockId === socket.id) {
                    delete global.connectedEmployees[id];
                }
            }
            for (const [id, sockId] of Object.entries(global.connectedCustomers)) {
                if (sockId === socket.id) {
                    delete global.connectedCustomers[id];
                }
            }
        })
    })
}