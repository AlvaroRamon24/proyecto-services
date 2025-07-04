import Solicitud from '../models/Solicitud.js';
import Customer from '../models/Customer.js';
import Employee from '../models/Employee.js';
import Reject from '../models/Reject.js';
import SolicitudRunCustomer from '../models/SolicitudRunCustomer.js';
import SolicitudRunEmployee from '../models/SolicitudRunEmployee.js';
import Review from '../models/Review.js';

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

export const guardarSolicitudCustomerRun = async (req, res) => {
  try {
    const { photoUrl, nombre, customerId, employeeId } = req.body;

    const solicitudRun = await SolicitudRunCustomer.create({customerId: customerId, employeeId: employeeId, name: nombre, photo: photoUrl})
    res.status(201).json(solicitudRun);
  } catch (error) {
    console.error('error al guardar data a la base de datos', error);
  }
}

export const guardarSolicitudEmployeeRun = async (req, res) => {
  try {
    const { photoUrl, nombre, customerId, employeeId } = req.body;

    const solicitudRun = await SolicitudRunEmployee.create({customerId: customerId, employeeId: employeeId, name: nombre, photo: photoUrl})
    res.status(201).json(solicitudRun);
  } catch (error) {
    console.error('error al guardar data a la base de datos', error);
  }
}

export const obtenerSolicitudCustomerRun = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await SolicitudRunCustomer.find({ customerId: id, isActive: false })
    console.log(response);
    res.status(201).json(response)

  } catch (error) {
    console.error('error al obtener solicitud Run', error);
  }
}

export const obtenerSolicitudEmployeeRun = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await SolicitudRunEmployee.find({ employeeId: id, isActive: false })
    console.log(response);
    res.status(201).json(response)

  } catch (error) {
    console.error('error al obtener solicitud Run', error);
  }
}

export const createReview = async (req, res) => {
  try {
    const { comentario, calificacion, hoverRating, customerId, employeeId, userType } = req.body;
    const response = await Review.create({ 
      customerId: customerId,
      employeeId: employeeId,
      comentario: comentario,
      calificacion: calificacion,
      hoverRating: hoverRating,
      autor: userType
    })
    console.log(response);
    res.status(201).json(response)

  } catch (error) {
    console.error('error al obtener solicitud Run', error);
  }
}

export const getReview = async (req, res) => {
  try {
    const { id, userType } = req.params;
    let filter = {}

    if(userType === 'customer') {
      filter = { customerId: id, autor: 'employee' }
    } else if(userType === 'employee') {
      filter = { employeeId: id, autor: 'customer' }
    } else {
      return res.status(404).json({ message: 'usuario no valido' })
    }
    const reviews = await Review.find(filter)
    .populate({ path: 'employeeId', model: 'Employee', select: 'name photo' })
    .populate({ path: 'customerId', model: 'Customer', select: 'name photo' });

    if (!reviews || reviews.length === 0) {
      return res.json({ message: 'No se encontraron reviews para este usuario.' });
    }

    res.status(201).json(reviews);
  } catch (error) {
    console.error('Error al obtener reviews:', error);
    res.status(500).json({ message: 'Error del servidor al obtener las reviews.' });
  }
};

export const updateSolicitudCustomerRunId = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await SolicitudRunCustomer.findByIdAndUpdate(id, { isActive: true }, { new: true })
    
    if(!response) {
      res.status(404).json({message: 'ServiceRunCustomer no encontrado'});
    }

    res.status(201).json(response);
  } catch (error) {
    console.error('Error al modificar el solicitud run Customer seleccionado', error);
  }
}

export const updateSolicitudEmployeeRunId = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await SolicitudRunEmployee.findByIdAndUpdate(id, { isActive: true }, { new: true })
    
    if(!response) {
      res.status(404).json({message: 'ServiceRunEmployee no encontrado'});
    }

    res.status(201).json(response);
  } catch (error) {
    console.error('Error al modificar el solicitud run Employee seleccionado', error);
  }
}

