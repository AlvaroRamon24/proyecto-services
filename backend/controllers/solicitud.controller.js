import Solicitud from '../models/Solicitud.js';
import Customer from '../models/Customer.js';
import Employee from '../models/Employee.js';
import Reject from '../models/Reject.js';

let io;
export const setSocketIO = (socketInstance) => {
  io = socketInstance;
};

export const crearSolicitud = async (req, res) => {
  try {
    const { customerId, employeeId, service, comment } = req.body;
    const nueva = await Solicitud.create({ customerId, employeeId, service, comment });

    const socketId = global.connectedEmployees[employeeId];
    if (socketId) {
      const cliente = await Customer.findById(customerId).lean();
      const solicitudConNombre = {
        ...nueva.toObject(),
        customerNombre: cliente?.name || 'Desconocido',
        customerFoto: cliente?.photo || null,
        customerStar: cliente?.qualifications || 0
      };
      io.to(socketId).emit('nueva_solicitud', solicitudConNombre);
    }
    res.status(201).json(nueva);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerSolicitudesEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitudes = await Solicitud.find({ employeeId: id }).sort({ fecha: -1 });

    // Obtener nombres de clientes
    const solicitudesConNombre = await Promise.all(
      solicitudes.map(async (sol) => {
        const cliente = await Customer.findById(sol.customerId).lean();
        return {
          ...sol.toObject(),
          customerNombre: cliente?.name || 'Desconocido',
          customerFoto: cliente?.photo || null,
          customerStar: cliente?.qualifications || 0
        };
      })
    );

    res.json(solicitudesConNombre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const rejectSolicitud = async (req, res) => {
  try {
    const { customerId, employeeId, service, comment, serviceId } = req.body;
    const nueva = await Reject.create({ customerId, employeeId, service, comment });

    const socketId = global.connectedCustomers[customerId];
    if (socketId) {
      const trabajador = await Employee.findById(employeeId).lean();
      const solicitudConNombre = {
        ...nueva.toObject(),
        employeeNombre: trabajador?.name || 'Desconocido',
        employeeFoto: trabajador?.photo || null,
        employeeStar: trabajador?.qualifications || 0
      };
      io.to(socketId).emit('reject_solicitud', solicitudConNombre);
    }
    // 3. Eliminar la solicitud de la base de datos
    const deleted = await Solicitud.findByIdAndDelete(serviceId);
    // 4. Notificar al empleado solo si se eliminó exitosamente
    if (deleted) {
      const employeeSocket = global.connectedEmployees[employeeId];
      if (employeeSocket) {
        io.to(employeeSocket).emit('solicitud_eliminada', { serviceId });
      }
    }

    res.status(201).json(nueva);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerSolicitudesCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitudes = await Reject.find({ customerId: id }).sort({ fecha: -1 });

    // Obtener nombres de trabajador
    const solicitudesConNombre = await Promise.all(
      solicitudes.map(async (sol) => {
        const trabajador = await Employee.findById(sol.employeeId).lean();
        return {
          ...sol.toObject(),
          employeeNombre: trabajador?.name || 'Desconocido',
          employeeFoto: trabajador?.photo || null,
          employeeStar: trabajador?.qualifications || 0
        };
      })
    );

    res.json(solicitudesConNombre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const deleteRejectCustomer = async (req, res) => {
  try {
    const { solicitudId } = req.params;
    const solicitud = await Reject.findByIdAndDelete(solicitudId);
    res.status(200).json(solicitud);

  } catch (error) {
    console.error('Error al eliminar solicitud', error);
  }
}
//prueba
export const getSearchUsuario = async (req, res) => {
  try {
    const { userId } = req.params;

    // busca en empleados o clientes, según el ID
    const usuario = await Customer.findById(userId) || await Employee.findById(userId);

    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ nombre: usuario.name, photoUrl: usuario.photo });
  } catch (error) {
    console.error('Error al buscar datos del usuario', error);
  }
}