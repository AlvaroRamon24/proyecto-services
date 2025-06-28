import React, { useState } from 'react';
import { Star } from 'lucide-react';

const ReviewPopup = ({ servicio, onClose }) => {
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(0); // Cambiado a 0 para que no tenga valor inicial
  const [hoverRating, setHoverRating] = useState(0);

  const ratingTexts = {
    1: "😞 Muy insatisfecho",
    2: "😕 Insatisfecho", 
    3: "😐 Regular",
    4: "😊 Satisfecho",
    5: "🤩 Muy satisfecho"
  };

  const handleEnviar = () => {
    if (calificacion === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }
    
    console.log('Enviando reseña:', { servicio, comentario, calificacion });
    // Aquí puedes enviar la reseña al backend
    onClose();
  };

  const displayRating = hoverRating || calificacion;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h4 style={styles.title}>Reseña para el servicio: {servicio?.service}</h4>
        
        {/* Sistema de estrellas dinámico */}
        <div style={styles.ratingSection}>
          <label style={styles.ratingLabel}>¿Cómo calificarías el servicio?</label>
          <div style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={40}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: star <= displayRating ? '#ffd700' : '#ddd',
                  fill: star <= displayRating ? '#ffd700' : 'transparent',
                  transform: star <= displayRating ? 'scale(1.1)' : 'scale(1)',
                  filter: star <= displayRating ? 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))' : 'none'
                }}
                onClick={() => setCalificacion(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>
          <div style={styles.ratingText}>
            {displayRating ? ratingTexts[displayRating] : 'Selecciona tu calificación'}
          </div>
        </div>

        <textarea
          placeholder="Escribe tu comentario (opcional)"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows={4}
          style={styles.textarea}
        />
        
        <div style={styles.buttonContainer}>
          <button onClick={onClose} style={styles.cancelBtn}>
            Cancelar
          </button>
          <button 
            onClick={handleEnviar} 
            style={{
              ...styles.sendBtn,
              backgroundColor: calificacion === 0 ? '#ccc' : '#007bff',
              cursor: calificacion === 0 ? 'not-allowed' : 'pointer',
              opacity: calificacion === 0 ? 0.6 : 1
            }}
            disabled={calificacion === 0}
          >
            Enviar Reseña
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, 
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    background: 'white',
    padding: '30px',
    borderRadius: '15px',
    width: '450px',
    maxWidth: '90%',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
  },
  title: {
    marginBottom: '20px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    textAlign: 'center'
  },
  ratingSection: {
    marginBottom: '25px',
    textAlign: 'center'
  },
  ratingLabel: {
    display: 'block',
    marginBottom: '15px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#333'
  },
  starsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '10px'
  },
  ratingText: {
    height: '24px',
    fontSize: '16px',
    color: '#666',
    fontWeight: '500'
  },
  textarea: {
    width: '100%', 
    padding: '15px', 
    marginTop: '10px', 
    borderRadius: '8px',
    border: '2px solid #e1e5e9',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.3s ease'
  },
  buttonContainer: {
    marginTop: '25px', 
    display: 'flex', 
    justifyContent: 'flex-end',
    gap: '10px'
  },
  cancelBtn: {
    padding: '12px 20px',
    backgroundColor: '#f8f9fa',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#666',
    transition: 'all 0.2s ease'
  },
  sendBtn: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  }
};

// Componente de ejemplo para mostrar el uso
const App = () => {
  const [showReview, setShowReview] = useState(true);
  
  const servicioEjemplo = {
    service: "Reparación de aires acondicionados"
  };

  const handleClose = () => {
    setShowReview(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
          Demo Review Popup
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
          Sistema de calificación con estrellas dinámicas
        </p>
        <button 
          onClick={() => setShowReview(true)}
          style={{
            padding: '15px 30px',
            backgroundColor: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(255,255,255,0.3)'
          }}
        >
          Mostrar Popup de Calificación
        </button>
      </div>

      {showReview && (
        <ReviewPopup 
          servicio={servicioEjemplo} 
          onClose={handleClose} 
        />
      )}
    </div>
  );
};

export default App;