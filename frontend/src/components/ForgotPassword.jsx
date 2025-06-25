import { useState } from "react";
import '../App.css';
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email) {
      alert("Por favor, ingresa tu correo.");
      return;
    }
    // Validación: ¿Tiene formato válido de email?
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Correo inválido. Asegúrate de escribirlo correctamente.");
      return;
    }
  
    try {
      const res = await axios.post("http://localhost:4500/auth/forgot-password", { email });
      alert(res.data.message); 
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Error de red. Verifica tu conexión.");
      }
    }
    setEmail("");
  };
  

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center" style={{
      background: "linear-gradient(to right, #f9f9f9, #ececec)"
    }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="text-center mb-4">
          <i className="bi bi-lock-fill fs-1 fs-9 bg-purple"></i>
          <h4 className="mt-2">restablecer contraseña</h4>
          <p className="text-muted small">Ingresa tu email para enviarte un enlace de recuperación.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-envelope-fill text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 custom-placeholder"
                placeholder="ingresa tu email"
                maxLength={30}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn bg-purple-btn w-100">
          <i className="bi bi-send-fill me-2"></i>
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
