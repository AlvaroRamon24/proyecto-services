import UsersChats from '../models/UsersChats.js';

export const saveChatCerrados = async (req, res) => {
    const { roomId, usuarioId, destinatario, fotoUrl } = req.body;

    try {
        const chatExistente = await UsersChats.findOne({ roomId, usuarioId, destinatario });
        if (chatExistente) {
            return res.json({ message: 'El chat ya existe' });
        }
        const newUserChat = new UsersChats({
            roomId,
            usuarioId,
            destinatario,
            fotoUrl
        });
        await newUserChat.save();
        return res.status(201).json({ message: 'Chat cerrado guardado exitosamente', userChat: newUserChat });

    } catch (error) {
        console.error('Error al guardar el chat cerrado:', error);
        return res.status(500).json({ message: 'Error al guardar el chat cerrado' });
        
    }
}

export const getUsersChatsClose = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await UsersChats.find({ usuarioId: id })
        res.status(200).json(response);

    } catch (error) {
        console.error('Error al obtener los chats cerrados:', error);
        return res.status(500).json({ message: 'Error al obtener los chats cerrados' });
    }
}