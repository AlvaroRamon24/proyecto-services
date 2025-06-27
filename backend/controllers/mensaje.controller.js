import Mensaje from "../models/Mensaje.js";
import Customer from "../models/Customer.js";
import Employee from "../models/Employee.js";

export const saveMensaje = async (req, res) => {
    const { roomId, customerId, employeeId, de, nombre, texto, hora } = req.body;

    try {
        const nuevoMensaje = new Mensaje({
            roomId,
            customerId,
            employeeId,
            de,
            nombre,
            texto,
            hora
        });

        await nuevoMensaje.save();
        res.status(201).json(nuevoMensaje);
    } catch (error) {
        console.error("Error al guardar el mensaje:", error);
        res.status(500).json({ message: "Error al guardar el mensaje" });
    }
}

export const getMensajesByRoomId = async (req, res) => {
    const { roomId } = req.params;

    try {
        const mensajes = await Mensaje.find({ roomId }).sort({ createdAt: 1 });
        res.status(200).json(mensajes);
    } catch (error) {
        console.error("Error al obtener los mensajes:", error);
        res.status(500).json({ message: "Error al obtener los mensajes" });
    }
}

export const getConversacionesPorUsuario = async (req, res) => {
  const { userId } = req.query;

  try {
    const conversaciones = await Mensaje.aggregate([
      {
        $match: {
          $or: [
            { customerId: userId },
            { employeeId: userId }
          ]
        }
      },
      {
        $sort: { createdAt: 1 }
      },
      {
        $group: {
          _id: "$roomId",
          ultimoMensaje: { $last: "$$ROOT" }
        }
      }
    ]);

    const resultados = await Promise.all(
      conversaciones.map(async (conv) => {
        const { customerId, employeeId, roomId } = conv.ultimoMensaje;

        const esCliente = userId === customerId;
        const otroUsuarioId = esCliente ? employeeId : customerId;

        // Buscar al otro usuario en ambas colecciones
        let otroUsuario;
        try {
          otroUsuario = await Customer.findById(otroUsuarioId).lean();
          if (!otroUsuario) {
            otroUsuario = await Employee.findById(otroUsuarioId).lean();
          }
        } catch (e) {
          console.error("Error buscando el otro usuario:", e);
        }

        return {
          roomId,
          destinatario: otroUsuario?.nombre || 'Desconocido',
          fotoUrl: otroUsuario?.photoUrl || 'https://i.pravatar.cc/150?img=47',
          mensajes: [],
          visible: false
        };
      })
    );

    res.status(200).json(resultados);
  } catch (error) {
    console.error("Error al obtener conversaciones:", error);
    res.status(500).json({ message: "Error al obtener conversaciones" });
  }
};
