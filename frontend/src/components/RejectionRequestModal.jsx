// src/components/ServiceRequestModal.jsx
import { useState } from 'react';
import axios from 'axios';

const RejectionRequestModal = ({ isOpen, onClose, employeeId, customerId, service, serviceId }) => {
  const [comment, setComment] = useState('');

  const enviarSolicitud = async () => {

    if (comment.trim() === '') {
      alert('Ingrese un comentario');
      return;
    }
    if (comment.trim().length < 5) {
      alert('El comentario debe tener al menos 5 caracteres');
      return;
    }

    if (comment.trim().length > 40) {
      alert('El comentario no puede tener más de 40 caracteres');
      return;
    }
    const payload = {
      customerId,
      employeeId,
      service,
      comment,
      serviceId
    };

    try {
      await axios.post('http://localhost:4500/solicitud/reject/', payload);
      onClose(); // Cierra el modal
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      alert('Error al enviar la solicitud');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={{fontWeight:"bold"}}>Motivo del rechazo</h2>
        <h3 style={{fontSize:"18px"}}>servicio: {service}</h3>
        <textarea
          rows={5}
          placeholder="Escribe el motivo del rechazo..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={styles.textarea}
        />
        <div style={styles.buttons}>
          <button onClick={onClose} style={styles.cancel}>Cancelar</button>
          <button onClick={enviarSolicitud} style={styles.submit}>Enviar</button>
        </div>
      </div>
    </div>
  );
};

// Estilos básicos
const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
  },
  modal: {
    background: 'white', padding: '2rem', borderRadius: '8px', width: '400px'
  },
  textarea: {
    width: '100%', marginTop: '1rem', padding: '0.5rem'
  },
  buttons: {
    display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'
  },
  cancel: {
    marginRight: '1rem', padding: '0.5rem 1rem', background: '#ccc', border: 'none', borderRadius: '5px'
  },
  submit: {
    padding: '0.5rem 1rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px'
  }
};

export default RejectionRequestModal;
