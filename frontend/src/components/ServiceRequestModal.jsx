import { useState } from 'react';
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';
import { LoadingButton } from '@mui/lab';

// Lista personalizada de malas palabras en español
const palabrasProhibidas = [
  'puta', 'puto', 'mierda', 'pendejo', 'carajo', 'conchudo', 'webon',
  'imbecil', 'estupido', 'huevon', 'cojudo', 'maldito', 'perra', 'tonto'
];

// Función para limpiar el comentario
const limpiarComentario = (texto) => {
  const mapa = {
    '@': 'a', '4': 'a',
    '1': 'i', '!': 'i', '¡': 'i',
    '3': 'e',
    '0': 'o',
    '$': 's',
    '*': '',
    '.': '', ',': '', '-': '', '_': '', '|': '',
    '#': '', '+': '', '(': '', ')': ''
  };

  const normalizado = texto
    .toLowerCase()
    .split('')
    .map(c => mapa[c] || c)
    .join('');

  const palabras = normalizado.split(/\s+/);
  const resultado = palabras.filter(p => !palabrasProhibidas.includes(p));
  return resultado.join(' ');
};

const ServiceRequestModal = ({ isOpen, onClose, employeeId, customerId, service }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const comentarioFiltrado = limpiarComentario(comment);

    const payload = {
      customerId,
      employeeId,
      service,
      comment: comentarioFiltrado
    };

    try {
      await axios.post('http://localhost:4500/solicitud/', payload);
      onClose(); // Cierra el modal
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      alert('Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={{ fontSize: "19px" }}>
          Solicitar servicio: <strong>{service}</strong>
        </h2>
        <textarea
          rows={5}
          placeholder="Escribe un comentario para el trabajador..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={styles.textarea}
        />
        <div style={styles.buttons}>
          <button onClick={onClose} style={styles.cancel}>Cancelar</button>
          <LoadingButton
            onClick={enviarSolicitud}
            endIcon={<SendIcon />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
            color="primary"
          >
            Pedir servicio
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

// Estilos
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
  }
};

export default ServiceRequestModal;
