import React, { useState } from "react";
import logo from "../assets/logoservice.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../App.css';

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
const navigate = useNavigate();

const handleLogin = (e) => {
  e.preventDefault();
  axios.post("http://localhost:4500/auth/login", form)
    .then((response) => {
      const { token, role, id } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", id);

      if (role === "customer") {
        navigate(`/customer/dashboard/${id}`);
      } else if (role === "employee") {
        navigate(`/employee/dashboard/${id}`);
      } else if (role === "admin") {
        navigate(`/admin/dashboard/${id}`);
      }
    })
    .catch((error) => {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 || status === 401) {
          alert(data.message || "Credenciales incorrectas");
        } else {
          alert("Error inesperado: " + (data.message || status));
        }
      } else {
        alert("No se pudo conectar con el servidor");
      }
      //console.error("Error al iniciar sesión:", error);
    });
};


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }
  return (
    <div className="container-fluid bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center">
  <div className="card shadow-lg border-1 p-4 mb-3" style={{ maxWidth: "400px", width: "100%" }}>
    <div className="text-center mb-4">
      <img
        src={logo}
        alt="Logo"
        width="150"
        height="150"
      />
      <h4 className="mt-3 fs-6">Iniciar Seccion</h4>
    </div>

    <form onSubmit={handleLogin}>
      <div className="mb-3">
        <div className="input-group shadow-sm">
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-envelope-fill text-muted"></i>
          </span>
        <input
          type="text"
          className="form-control custom-placeholder"
          placeholder="ingresa tu email"
          value={form.email}
          name="email"
          maxLength={30}
          onChange={handleChange}
        />
        </div>
      </div>

      <div className="mb-3">
        <div className="input-group shadow-sm">
          <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-lock-fill text-muted"></i>
          </span>
        <input
          type="password"
          className="form-control custom-placeholder"
          placeholder="ingresa tu contraseña"
          value={form.password}
          maxLength={30}
          minLength={3}
          name="password"
          onChange={handleChange}
        />
        </div>
      </div>

      <div className="d-flex justify-content-between mb-3">
        <Link to="/forgot-password" className="text-decoration-none small">Olvidaste tu Contraseña?</Link>
      </div>

      <button type="submit" className="btn bg-purple-btn w-100">
      <i className="bi bi-box-arrow-in-right me-2"></i>
        Iniciar
      </button>
    </form>
  </div>

  <div className="text-center card shadow-lg border-1 p-4 mb-3 bg-light" style={{ maxWidth: "400px", width: "100%" }}>
  <span className="text-muted small">
    Todavia no estas registrado?{" "}
    <Link to="/signup" className="text-decoration-none fw-semibold" style={{ color: "#8b59d7" }}>
      Registrarse
    </Link>
  </span>
</div>


</div>
  );
};

export default SignIn;
