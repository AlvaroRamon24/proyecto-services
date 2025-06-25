// src/components/ServiceRequestModal.jsx
import { useState } from 'react';
import axios from 'axios';

const ServiceRequestModal = ({ isOpen, onClose, employeeId, customerId, service }) => {
  const [comment, setComment] = useState('');

  const enviarSolicitud = async () => {
    const payload = {
      customerId,
      employeeId,
      service,
      comment
    };

    try {
      await axios.post('http://localhost:4500/solicitud/', payload);
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
        <h2 style={{fontSize:"19px"}}>Solicitar servicio: <strong>{service}</strong></h2>
        <textarea
          rows={5}
          placeholder="Escribe un comentario para el trabajador..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={styles.textarea}
        />
        <div style={styles.buttons}>
          <button onClick={onClose} style={styles.cancel}>Cancelar</button>
          <button onClick={enviarSolicitud} style={styles.submit} className='btn btn-primary'>Pedir servicio</button>
        </div>
      </div>
    </div>
  );
};

// Estilos básicos
const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    zIndex: 5000,
    backgroundColor: 'rgba(74, 72, 72, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
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
    padding: '0.5rem 1rem', color: 'white', border: 'none', borderRadius: '5px'
  }
};

export default ServiceRequestModal;
