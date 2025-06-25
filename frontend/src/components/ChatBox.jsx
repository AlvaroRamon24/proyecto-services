import { useEffect, useState, useRef } from 'react';
import socket from '../socket.js';
import axios from 'axios';

export default function ChatBox({ roomId, usuarioId, destinatario, remitente, visible, imageUrl, setVisible, style }) {
  const [mensajes, setMensajes] = useState([]);
  const [nuevo, setNuevo] = useState('');
  const mensajesEndRef = useRef(null);
  const [escribiendo, setEscribiendo] = useState(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    const recibir = (mensajerecibidoRoomId, mensaje) => {
      if(mensajerecibidoRoomId !== roomId) return;
      console.log('Llegó mensaje', mensaje);

      setMensajes((prev) => [...prev, mensaje]);
    };

    socket.on('nuevo_mensaje', recibir);
    console.log('Suscrito a nuevo_mensaje xd');

    return () => socket.off('nuevo_mensaje', recibir);
  }, [roomId]);

  useEffect(() => {
    // 👇 Scroll automático al final cada vez que cambia la lista de mensajes
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, escribiendo]);


  useEffect(() => {
    socket.on('usuarioEscribiendo', (nombre) => {
      setEscribiendo(`${nombre} está escribiendo...`);
    });

    socket.on('usuarioParoDeEscribir', () => {
      setEscribiendo(null);
    });

    return () => {
      socket.off('usuarioEscribiendo');
      socket.off('usuarioParoDeEscribir');
    };
  }, []);

  const enviar = () => {
    if (!nuevo.trim()) return;

    const mensaje = {
      de: usuarioId,
      nombre: destinatario,
      texto: nuevo,
      hora: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
    };
    socket.emit('enviar_mensaje', { roomId, mensaje });
    socket.emit('stopTyping', { roomId });
    setNuevo('');
  };

  if (!visible) return null;

  return (
    <div style={{...chatStyle.container, ...style}}>
      <div style={chatStyle.header}>
        <img
          src={imageUrl}
          alt={destinatario}
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginRight: '10px',
          }}
        />
        {destinatario}
        <button
          onClick={() => setVisible(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>
      <div style={chatStyle.mensajes}>
        {mensajes.map((m, i) => (
          <div
            key={i}
            style={{
              ...chatStyle.mensaje,
              alignSelf: m.de === usuarioId ? 'flex-end' : 'flex-start',
              backgroundColor: m.de === usuarioId ? '#0084ff' : '#e5e5ea',
              color: m.de === usuarioId ? '#fff' : '#000',
            }}
          >
            <div style={{ fontSize: '11px', marginBottom: 0, opacity: 0.6 }}>
              {m.de === usuarioId ? 'yo' : destinatario}
            </div>
            {m.texto}
            <div style={chatStyle.hora}>{m.hora}</div>
          </div>
        ))}
        {escribiendo && (
          <div style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#888', paddingLeft: 10 }}>
            {escribiendo}
          </div>
        )}
        <div ref={mensajesEndRef} />
      </div>
      <div style={chatStyle.inputContainer}>
        <input
          value={nuevo}
          onChange={(e) => {
            setNuevo(e.target.value)
            socket.emit('typing', { roomId, nombre: remitente });

            clearTimeout(typingTimeout.current);
            typingTimeout.current = setTimeout(() => {
              socket.emit('stopTyping', { roomId });
            }, 1000); // 2 segundos sin escribir
          }}
          style={chatStyle.input}
          placeholder="Escribe un mensaje..."
          onKeyDown={(e) => e.key === 'Enter' && enviar()}
        />
        <button onClick={enviar} style={chatStyle.boton}>Enviar</button>
      </div>
    </div>
  );
}

const chatStyle = {
  container: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    width: 320,
    height: 400,
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #ccc',
    borderRadius: 8,
    background: '#f9f9f9',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    zIndex: 2000,
  },
  header: {
    backgroundColor: '#0084ff',
    color: '#fff',
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  mensajes: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    overflowY: 'auto',
    gap: 8,
    backgroundColor: '#ffffff',
  },
  mensaje: {
    maxWidth: '70%',
    padding: '8px 12px',
    borderRadius: 18,
    fontSize: 15,
    position: 'relative',
    wordBreak: 'break-word',
  },
  hora: {
    fontSize: 10,
    opacity: 0.6,
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    display: 'flex',
    borderTop: '1px solid #ccc',
    padding: 8,
    background: '#fff',
  },
  input: {
    flex: 1,
    padding: '6px 10px',
    borderRadius: 20,
    border: '1px solid #ccc',
    outline: 'none',
    fontSize: 14,
  },
  boton: {
    marginLeft: 8,
    padding: '6px 14px',
    borderRadius: 20,
    backgroundColor: '#0084ff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  }
};
