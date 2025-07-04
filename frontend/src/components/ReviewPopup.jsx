import React, { useState } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';

export default function ReviewPopup ({ servicio, onClose, setServiceRun, serviceRun, userType }){
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const ratingTexts = {
    1: "😞 Muy insatisfecho",
    2: "😕 Insatisfecho", 
    3: "😐 Regular",
    4: "😊 Satisfecho",
    5: "🤩 Muy satisfecho"
  };

  //funcion para hacer peticion post y guardar la reseña(calificacion)
  const handleEnviar = async () => {
    if (calificacion === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }
    console.log('Enviando reseña:', { servicio, comentario, calificacion });
    console.log('servicioId: ', servicio)
    const id = servicio._id;
    const newReview = {
      userType,
      comentario, 
      calificacion, 
      hoverRating,
      customerId: servicio.customerId,
      employeeId: servicio.employeeId
      }
    try {
      const response = await axios.post('http://localhost:4500/solicitud/review', newReview)
      if(response.status === 201) {
        if(!servicio.isActive) {
          const updateService = 
          userType === 'customer' 
          ? `http://localhost:4500/solicitud/update-solicitudCustomerRun/${id}`
          : `http://localhost:4500/solicitud/update-solicitudEmployeeRun/${id}`

         const result =  await axios.put(updateService)
         console.log(result);
        }
      }
      setServiceRun(serviceRun.filter(element => element._id !== servicio._id));
    } catch (error) {
      console.log('error al enviar datos al backend', error);
    } finally {
      onClose();
    }
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

//estilos css para el pop up de reseña(calificación)
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
