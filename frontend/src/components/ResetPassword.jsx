import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import "../App.css";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!password) {
      alert("Por favor, ingresa su password.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:4500/auth/reset-password", { token, password });
      alert(res.data.message); 
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Error de red. Verifica tu conexión.");
      }
    }
    setPassword("");
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        padding: "20px",
        background: "linear-gradient(to right, #f9f9f9, #ececec)"
      }}
    >
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="text-center mb-4">
          <i className="bi bi-unlock-fill fs-1 bg-purple"></i>
          <h4 className="mt-3">Resetear Contraseña</h4>
          <p className="text-muted small">Ingresa tu nueva contraseña</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-lock-fill text-muted"></i>
              </span>
              <input
                type="password"
                className="form-control border-start-0 custom-placeholder"
                placeholder="Ingresa tu email"
                maxLength={8}
                minLength={3}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-light w-100 shadow-sm bg-purple-btn">
          <i className="bi bi-send-fill me-2"></i>
            Resetear
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
