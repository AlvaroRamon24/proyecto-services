import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import '../App.css'

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("Token no encontrado.");
        setLoading(false);
        return;
      }
      console.log("Token desde useParams:", token);

      try {
        const response = await axios.post("http://localhost:4500/auth/verify-email", { token });
        if (response.data.success) {
          setStatus(response.data.message);
        } else {
          setStatus("No se pudo verificar el correo.");
        }
      } catch (error) {
        setStatus("Error al verificar el correo.");
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [token]);

  return (
    <div className="container-home">
      {loading ? (
        <div className="container-spinner">
        <div className="spinner"></div>
        <p>verificando tu correo...</p>
        </div>
      ) : (
        <div>
          <img src={"https://previews.123rf.com/images/wallacefdesigner/wallacefdesigner2012/wallacefdesigner201201060/161120197-icono-de-correo-electrónico-en-un-vector-abstracto-de-círculo.jpg"} width="200px"/>
          <h2>{status}</h2>
        </div>
      )}
    </div>
  );  
}

