import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import '../App.css';

export default function RegisterVerification() {
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const userData = location.state?.form;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate("/signup");
      return;
    }

    const registerConnection = async () => {
      try {
        const response = await axios.post("http://localhost:4500/auth/register", userData);
        if (response.status === 201) {
          setData(response.data.message);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message);
        } else {
          alert("Hubo un error al registrar el usuario");
        }
        console.error("Error durante la registración", error);
      }
    };

    registerConnection();
  }, [userData]);

  return loading ? (
    <div className="container-spinner">
      <div className="spinner"></div>
      <p>cargando...</p>
    </div>
  ) : (
    <div className="container">
      <h1>{data}</h1>
    </div>
  );
}
