import React, { useState } from "react";
import logo from "../assets/logoservice.png";
//import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../App.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.lastName || !form.email || !form.password || !form.role) {
      return alert("Todos los campos son requeridos.");
    }
      try {
        const response = await axios.post("http://localhost:4500/auth/register", form);
        if (response.status === 201) {
          alert(response.data.message);
          navigate("/");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message);
        } else {
          alert("Hubo un error al registrar el usuario");
        }
        console.error("Error durante la registración", error);
      };
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target
    if ((name === "name" || name === "lastName") && /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(value)) {
      return; // Ignora si no es letra o espacio
    }
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(to right,rgb(230, 234, 241),rgb(238, 242, 248))",
      }}
    >
      <div
        className="card shadow-lg border-0 p-4"
        style={{ width: "100%", maxWidth: "420px", borderRadius: "1rem" }}
      >
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="Logo"
            className="rounded-circle"
            width="120"
            height="120"
          />
          <h4 className="mt-3 fs-6">Registrar</h4>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <div className="input-group shadow-sm">
                <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-person-lines-fill text-muted"></i>
                </span>
                <input
                    type="text"
                    className="form-control border-start-0 custom-placeholder"
                    placeholder="nombre"
                    maxLength={30}
                    minLength={3}
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    style={{ transition: "0.3s" }}
                />
            </div>
          </div>

          <div className="mb-3">
            <div className="input-group shadow-sm">
                <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-person-lines-fill text-muted"></i>
                </span>
                <input
                    type="text"
                    className="form-control border-start-0 custom-placeholder"
                    placeholder="apellidos"
                    name="lastName"
                    maxLength={50}
                    minLength={5}
                    value={form.lastName}
                    onChange={handleChange}
                    style={{ transition: "0.3s" }}
                />
            </div>
          </div>

          <div className="mb-3">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-envelope-fill text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 custom-placeholder"
                placeholder="email"
                name="email"
                maxLength={30}
                value={form.email}
                onChange={handleChange}
                style={{ transition: "0.3s" }}
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
                className="form-control border-start-0 custom-placeholder"
                placeholder="Contraseña"
                name="password"
                maxLength={30}
                minLength={3}
                value={form.password}
                onChange={handleChange}
                style={{ transition: "0.3s"}}
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-person-fill text-muted"></i>
              </span>
            <select
              className="form-select shadow-sm custom-select"
              value={form.role}
              name="role"
              onChange={handleChange}
            >
              <option value=""disabled hidden>tipo de usuario</option>
              <option value="customer">Cliente</option>
              <option value="employee">Trabajador</option>
            </select>
            </div>
          </div>

          <button type="submit" className="btn bg-purple-btn w-100 shadow-sm fw-semibold">
            <i className="bi bi-person-plus-fill me-2"></i>
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;


