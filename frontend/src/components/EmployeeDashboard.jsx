import React, { useState, useEffect, useRef, use } from 'react';
import {
  User,
  Bell,
  Search,
  Menu,
  X,
  Home,
  Calendar,
  Settings,
  Briefcase,
  DollarSign,
  Users,
  Store,
  MessageCircleMore,
  LogOut,
  UserCircle,
  Clock,
  Star,
  MapPin,
  Save,
} from 'lucide-react';
import '../App.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ChatBox from './ChatBox.jsx';
import ReviewPopup from './ReviewPopup.jsx';
import socket from '../socket.js'; // Asegúrate de que la ruta sea correcta
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import RejectionRequestModal from './RejectionRequestModal.jsx'
const citiesWithDistricts = {
  Lima: [
    "Ancón", "Ate", "Barranco", "Breña", "Carabayllo", "Chaclacayo", "Chorrillos",
    "Cieneguilla", "Comas", "El Agustino", "Independencia", "Jesús María",
    "La Molina", "La Victoria", "Lince", "Los Olivos", "Lurigancho", "Lurín",
    "Magdalena del Mar", "Miraflores", "Pachacámac", "Pucusana", "Pueblo Libre",
    "Puente Piedra", "Rímac", "San Bartolo", "San Borja", "San Isidro",
    "San Juan de Lurigancho", "San Juan de Miraflores", "San Luis", "San Martín de Porres",
    "San Miguel", "Santa Anita", "Santa María del Mar", "Santa Rosa", "Santiago de Surco",
    "Surquillo", "Villa El Salvador", "Villa María del Triunfo"
  ],
  Arequipa: [
    "Alto Selva Alegre", "Cayma", "Cerro Colorado", "Characato", "Chiguata",
    "Jacobo Hunter", "José Luis Bustamante y Rivero", "La Joya", "Mariano Melgar",
    "Miraflores", "Mollebaya", "Paucarpata", "Pocsi", "Polobaya", "Quequeña",
    "Sabandia", "Sachaca", "San Juan de Siguas", "San Juan de Tarucani",
    "Santa Isabel de Siguas", "Santa Rita de Siguas", "Socabaya", "Tiabaya",
    "Uchumayo", "Vitor", "Yanahuara", "Yarabamba", "Yura"
  ],
  Cusco: [
    "Ccorca", "Poroy", "San Jerónimo", "San Sebastián", "Santiago", "Saylla", "Wanchaq"
  ],
  Trujillo: [
    "El Porvenir", "Florencia de Mora", "Huanchaco", "La Esperanza", "Laredo",
    "Moche", "Poroto", "Salaverry", "Simbal", "Trujillo", "Víctor Larco Herrera"
  ],
  Chiclayo: ["José Leonardo Ortiz", "La Victoria", "Monsefú", "Pimentel", "Reque"],
  Piura: ["Castilla", "Catacaos", "Cura Mori", "El Tallán", "La Arena", "La Unión", "Las Lomas"],
  Iquitos: ["Belén", "Punchana", "San Juan Bautista"],
  Tacna: ["Alto de la Alianza", "Calana", "Ciudad Nueva", "Inclán", "Pachía", "Palca", "Pocollay"],
  Huancayo: [
    "Huancayo", "El Tambo", "Chilca", "San Agustín de Cajas",
    "Carhuacallanga", "Chacapampa", "Chicche", "Chongos Alto",
    "Chupuro", "Colca", "Cullhuas", "Huacrapuquio", "Hualhuas",
    "Huancán", "Huasicancha", "Huayucachi", "Ingenio", "Pariahuanca",
    "Pilcomayo", "Pucará", "Quichuay", "Quilcas", "San Agustín de Cajas",
    "San Jerónimo de Tunán", "San Pedro de Saño", "Santo Domingo de Acobamba",
    "Sapallanga", "Sicaya", "Viques"
  ],
  Chimbote: [
    "Chimbote", "Cáceres del Perú", "Coishco", "Macate", "Moro",
    "Nepeña", "Nuevo Chimbote", "Samanco", "Santa"
  ],
  Juliaca: [
    "Juliaca", "Caracoto", "Cabana", "Cabanillas", "San Miguel"
  ],
  Ica: [
    "Ica", "La Tinguiña", "Los Aquijes", "Ocucaje", "Pachacútec",
    "Parcona", "Pueblo Nuevo", "Salas", "San José de los Molinos",
    "San Juan Bautista", "Santiago", "Subtanjalla", "Tate",
    "Yauca del Rosario"
  ],
  Chincha: [
    "Chincha Alta", "Alto Larán", "Chavín", "Chincha Baja", "El Carmen",
    "Grocio Prado", "Pueblo Nuevo", "San Juan de Yanac", "San Pedro de Huacarpana",
    "Sunampe", "Tambo de Mora"
  ],
  Pucallpa: [
    "Callería"
  ],
  Cajamarca: [
    "Cajamarca", "Asunción", "Chetilla", "Cospán", "Encañada",
    "Jesús", "Llacànora", "Los Baños del Inca", "Magdalena",
    "Matara", "Namora", "San Juan"
  ],
  Sullana: [
    "Sullana", "Bellavista", "Ignacio Escudero", "Lancones",
    "Marcavelica", "Miguel Checa", "Querecotillo", "Salitral"
  ],
  Ayacucho: [
    "Ayacucho", "Acocro", "Acos Vinchos", "Carmen Alto",
    "Chiara", "Ocros", "Pacaycasa", "Quinua", "San José de Ticllas",
    "San Juan Bautista", "Santiago de Pischa", "Socos", "Tambillo",
    "Vinchos", "Jesús Nazareno"
  ],
  Huánuco: [
    "Huánuco", "Amarilis", "Chinchao", "Churubamba", "Margos",
    "Pillco Marca", "Quisqui", "San Francisco de Cayrán",
    "San Pedro de Chaulán", "Santa María del Valle",
    "Yarumayo", "Yacus", "San Pablo de Pillao"
  ],
  Tarapoto: [
    "Tarapoto", "La Banda de Shilcayo", "Morales", "Cacatachi", "Juan Guerra"
  ],
  Puno: [
    "Puno", "Acora", "Amantaní", "Atuncolla", "Capachica", "Chucuito",
    "Coata", "Huata", "Mañazo", "Paucarcolla", "Pichacani",
    "Platería", "San Antonio", "Tiquillaca", "Vilque"
  ]
};

const EmployeeDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [districtInput, setDistrictInput] = useState("");
  const [serviceRun, setServiceRun] = useState([]);// servicio en curso
  const [activeSection, setActiveSection] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [services, setServices] = useState([{ name: "", description: "" }]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  //prueba chat
  const [chatVisible, setChatVisible] = useState(false);
  const [roomId, setRoomId] = useState(null);
  // pruegba chat multiple
  const [chatsActivos, setChatsActivos] = useState([]);
  const [mensajesPorSala, setMensajesPorSala] = useState({});
  const [chatsCerrados, setChatsCerrados] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [servicio, setServicio] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [fotoUrl, setFotoUrl] = useState('');
  const [nombreOtroUsuario, setNombreOtroUsuario] = useState('');
  
  // Estado para el formulario de configuración
  const [settingsForm, setSettingsForm] = useState({
    name: "",
    lastName: "",
    phone: "",
    address: "",
    document: "",
    photo: "",
    city: "",
    district: "",
    services: {},
    coverage: [],
    qualifications: 0,
  });

  // Manejar el cambio de ciudad
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedDistrict(""); // Limpiar distrito anterior
  };

  // Manejar el cambio de distrito
  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };


  //
  // Maneja la solicitud de servicio al hacer clic en el botón "Rechazar Servicio"
  const handleRechazarServicio = (customerId, employeeId, service, serviceId) => {
    setCustomerId(customerId);
    setEmployeeId(employeeId);
    setServicio(service);
    setServiceId(serviceId);
    setModalOpen(true);
  };

  useEffect(() => {
    const getUsersChats = async () => {
      try {
        const response = await axios.get(`http://localhost:4500/users/chats/customer/${id}`)
        if (response.status === 200) {
          setChatsCerrados(response.data);
        }
      } catch (error) {
        console.error('Error al obtener los chats cerrados:', error);
      }
    }
    getUsersChats();
  }, [])

  // Cargar datos del empleado al montar el componente
  useEffect(() => {
    const getEmployeeData = async () => {
      try {
        const response = await axios.get(`http://localhost:4500/employee/${id}`);
        if (response.status === 200) {
          setSettingsForm(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error al obtener los datos del empleado:", error);
      }
    }
    getEmployeeData();
  }, [id]);

  // Datos simulados del empleado
  const employeeData = {
    name: settingsForm.name,
    email: settingsForm.email,
    role: settingsForm.role,
    rating: 4.8,
    completedJobs: 127,
    activeJobs: 3,
    earnings: "S/. 2,450"
  };

  // Menú específico para empleados
  const menuItems = [
    { id: 'overview', label: 'Panel Principal', icon: Home },
    { id: 'jobs', label: 'Mis Trabajos', icon: Briefcase },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'earnings', label: 'Mis Ganancias', icon: DollarSign },
    { id: 'reviews', label: 'Reseñas', icon: Star },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if ((name === "name" || name === "lastName") && /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(value)) {
      return; // Ignora si no es letra o espacio
    }
    if ((name === "document" || name === "phone") && /[^\d]/.test(value)) {
      return; // Ignora si no es un número (dígito)
    }

    setSettingsForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const serviceObject = {};
    services.forEach(({ name, description }) => {
      if (name.trim() && description.trim()) {
        serviceObject[name.trim()] = description.trim();
      }
    });
    const dataToUpdate = {
      ...settingsForm,
      photo: previewImage,
      services: serviceObject,

    }
    try {
      const response = await axios.put(`http://localhost:4500/employee/update/${id}`, dataToUpdate);
      if (response.status === 200) {
        alert('Información actualizada correctamente');
        setSettingsForm(response.data);
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const removeService = (index) => {
    if (services.length > 1) { // Mantener al menos un servicio
      setServices(services.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
  };

  const addService = () => {
    setServices([...services, { name: "", description: "" }]);
  };

  // Agregar distrito
  const addDistrict = () => {
    if (selectedDistrict && !settingsForm.coverage.includes(selectedDistrict)) {
      setSettingsForm((prev) => ({
        ...prev,
        coverage: [...prev.coverage, selectedDistrict],
      }));
    }
  };

  // Eliminar distrito
  const removeDistrict = (index) => {
    const updated = [...settingsForm.coverage];
    updated.splice(index, 1);
    setSettingsForm((prev) => ({ ...prev, coverage: updated }));
  };

  //Guardamos la foto seleccionada en editar perfil
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setSettingsForm((prev) => ({
          ...prev,
          photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (settingsForm.services && Object.keys(settingsForm.services).length > 0) {
      const servicesArray = Object.entries(settingsForm.services).map(([name, description]) => ({
        name,
        description
      }));
      setServices(servicesArray);
    }
  }, [settingsForm.services]);

  // Conectar al websocket y registramos el Id del employee y escuchamos el socket nueva_solicitud
  useEffect(() => {
    socket.emit('register_employee', id);
    axios.get(`http://localhost:4500/solicitud/employee/${id}`)
      .then(res => setSolicitudes(res.data))
      .catch(console.error);
    socket.on('nueva_solicitud', (nueva) => {
      setSolicitudes(prev => {
        const yaExiste = prev.some(el => el._id === nueva._id);
        if (yaExiste) return prev;
        return [nueva, ...prev];
      });
    });
    socket.on('solicitud_eliminada', ({ serviceId }) => {
      setSolicitudes(prev => prev.filter(el => el._id !== serviceId))
    })
    return () => {
      socket.off('nueva_solicitud');
      socket.off('solicitud_eliminada');
    };
  }, [id]);


  // Cuando employee acepta la solicitud emite y se une al chat privado(join_chat)
  const aceptarSolicitud = async (customerId, solicitudId) => {
    socket.emit('join_chat', { customerId, employeeId: id, isInitiator: true });
    try {
      const response = await axios.put(`http://localhost:4500/solicitud/update/${solicitudId}`)
      setSolicitudes(prev => prev.filter(el => el._id !== solicitudId));
      console.log(response.data);
    } catch (error) {
      console.error('Error al modificar Solicitud', error);
    }
  };

  useEffect(() => {
    const handleChatIniciado = async ({ roomId, customerId, employeeId }) => {
      socket.emit('servicio_en_curso', { customerId, employeeId: id, roomId });
      const userId = id === customerId ? employeeId : customerId;

      try {
        const res = await axios.get(`http://localhost:4500/solicitud/usuario/${userId}`);
        const nombre = res.data.nombre;
        const fotoUrl = res.data.photoUrl || 'https://i.pravatar.cc/150?img=47';

        setChatsActivos((prev) => {
          const chatExist = prev.some((chat) => chat.roomId === roomId);
          if (chatExist) return prev;

          return [
            ...prev, {
              roomId,
              usuarioId: id,
              remitente: settingsForm.name,
              destinatario: nombre,
              fotoUrl: fotoUrl,
            }
          ]
        })
      } catch (error) {
        console.error('Error obteniendo nombre del otro usuario:', error);
      }
    };
    socket.on('chat_iniciado', handleChatIniciado);

    return () => {
      socket.off('chat_iniciado', handleChatIniciado);
    };
  }, [id]);

  useEffect(() => {
    const handleServicioEnCurso = async ({ customerId, employeeId, roomId }) => {
      try {
        const userId = id === customerId ? employeeId : customerId;
        const searchInfoUser = await axios.get(`http://localhost:4500/solicitud/usuario/${userId}`);
        const newinfo = {
          ...searchInfoUser.data,
          customerId,
          employeeId
        }
        const response = await axios.post('http://localhost:4500/solicitud/guardar-employee', newinfo);
        setServiceRun((prev) => [...prev, response.data]);
      } catch (error) {
        console.error('Error obteniendo informacion del servicio en curso:', error);
      }
    };

    socket.on('mostrar_servicio_en_proceso', handleServicioEnCurso);

    return () => {
      socket.off('mostrar_servicio_en_proceso', handleServicioEnCurso);
    };
  }, [id]);

  //Apena renderiza la pagina hace peticion para traer todas las solicitudes con ese id pendiente
  useEffect(() => {
    const getSolicitudRun = async () => {
      try {
        const response = await axios.get(`http://localhost:4500/solicitud/employee/run/${id}`)
        setServiceRun(response.data);
      } catch (error) {
        console.error('error al hacer get', error);
      }
    }
    getSolicitudRun()
  }, [id])

  // Renderizar el contenido según la sección activa
  const renderMainContent = () => {
    if (activeSection === 'settings') {
      return (
        <div className="container-fluid">
          <div className="row justify-content-center">

            <div className="card shadow-sm" style={{ borderRadius: '15px' }}>
              <div className="card-header bg-white">
                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                    <Settings size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-1 fw-bold">Configuración de Perfil</h4>
                    <p className="text-muted mb-0">Actualiza tu información personal y preferencias</p>
                  </div>
                </div>
              </div>

              <div className="card-body" style={{ width: "820px" }}>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Foto de perfil */}
                    <div className="col-md-4 d-flex">
                      <div className="card border w-100" style={{
                        borderRadius: '8px',
                        borderColor: '#dee2e6',
                        backgroundColor: '#f8f9fa'
                      }}>
                        <div className="card-body p-3 d-flex flex-column justify-content-between">
                          <h6 className="fw-semibold text-dark mb-3 text-center border-bottom pb-2">
                            <i className="fas fa-camera me-2 text-secondary"></i>
                            Foto de Perfil
                          </h6>
                          <div className="text-center mb-3">
                            <div className="position-relative d-inline-block">
                              {settingsForm.photo && settingsForm.photo.trim() !== '' ? (
                                <img
                                  src={settingsForm.photo}
                                  alt="Vista previa"
                                  className="border rounded-circle"
                                  style={{
                                    width: '120px',
                                    height: '120px',
                                    objectFit: 'cover',
                                    borderColor: '#dee2e6 !important',
                                    borderWidth: '2px'
                                  }}
                                />
                              ) : (
                                <img
                                  src="https://media.istockphoto.com/id/2171382633/es/vector/icono-de-perfil-de-usuario-símbolo-de-persona-anónima-gráfico-de-avatar-en-blanco.jpg?s=612x612&w=0&k=20&c=4R1fa1xdOWF2fXr6LSwe0L7O1ojy60Mcy0n624Z4qns="
                                  alt="Vista default"
                                  className="border rounded-circle"
                                  style={{
                                    width: '120px',
                                    height: '120px',
                                    objectFit: 'cover',
                                    borderColor: '#dee2e6 !important',
                                    borderWidth: '2px'
                                  }}
                                />
                              )}
                              <div className="position-absolute bottom-0 end-0 bg-secondary rounded-circle p-1" style={{ border: '2px solid white' }}>
                                <i className="fas fa-camera text-white small"></i>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="form-label fw-semibold text-secondary mb-2 small">
                              <i className="fas fa-upload me-1"></i>
                              Subir nueva foto
                            </label>
                            <input
                              type="file"
                              name="photo"
                              className="form-control form-control-sm border"
                              style={{ borderRadius: '6px', backgroundColor: '#fff', borderColor: '#dee2e6' }}
                              onChange={handleFileChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Información Personal */}
                    <div className="col-12">
                      <h5 className="mb-3 d-flex align-items-center">
                        <User size={20} className="me-2 text-primary" />
                        Información Personal
                      </h5>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-medium">Nombre <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name='name'
                        className="form-control form-control-lg border-employee"
                        value={settingsForm.name}
                        onChange={handleInputChange}
                        maxLength={30}
                        placeholder="Ingresa tu nombre"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-medium">Apellidos <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name='lastName'
                        className="form-control form-control-lg border-employee"
                        value={settingsForm.lastName}
                        onChange={handleInputChange}
                        maxLength={30}
                        placeholder="Ingresa tus apellidos"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-medium">Celular</label>
                      <input
                        type="tel"
                        name='phone'
                        className="form-control form-control-lg border-employee"
                        value={settingsForm.phone}
                        minLength={9}
                        maxLength={9}
                        onChange={handleInputChange}
                        placeholder="Número de celular"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-medium">Documento de Identidad</label>
                      <input
                        type="text"
                        name='document'
                        className="form-control form-control-lg border-employee"
                        value={settingsForm.document}
                        minLength={8}
                        maxLength={8}
                        onChange={handleInputChange}
                        placeholder="DNI"
                      />
                    </div>

                    {/* Ubicación */}
                    <div className="col-12 mt-4">
                      <h5 className="mb-3 d-flex align-items-center">
                        <MapPin size={20} className="me-2 text-primary" />
                        Ubicación
                      </h5>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-dark mb-2 d-flex align-items-center">
                        <div className="d-flex align-items-center justify-content-center me-2" style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '6px'
                        }}>
                          <i className="fas fa-city text-secondary" style={{ fontSize: '18px' }}></i>
                        </div>
                        Ciudad
                      </label>
                      <select
                        className="form-select border-2 shadow-sm"
                        name="city"
                        value={settingsForm.city || ""}
                        onChange={handleInputChange}
                        style={{
                          borderRadius: '18px',
                          borderColor: '#e9ecef',
                          backgroundColor: '#fff',
                          padding: '12px 16px',
                          fontSize: '18px',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      >
                        {!settingsForm.city && <option value="" disabled>Seleccione una ciudad</option>}
                        <option value="Lima">Lima</option>
                        <option value="Arequipa">Arequipa</option>
                        <option value="Cusco">Cusco</option>
                        <option value="Trujillo">Trujillo</option>
                        <option value="Chiclayo">Chiclayo</option>
                        <option value="Piura">Piura</option>
                        <option value="Iquitos">Iquitos</option>
                        <option value="Huancayo">Huancayo</option>
                        <option value="Tacna">Tacna</option>
                        <option value="Chimbote">Chimbote</option>
                        <option value="Juliaca">Juliaca</option>
                        <option value="Ica">Ica</option>
                        <option value="Pucallpa">Pucallpa</option>
                        <option value="Cajamarca">Cajamarca</option>
                        <option value="Sullana">Sullana</option>
                        <option value="Ayacucho">Ayacucho</option>
                        <option value="Chincha">Chincha</option>
                        <option value="Huánuco">Huánuco</option>
                        <option value="Tarapoto">Tarapoto</option>
                        <option value="Puno">Puno</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-dark mb-2 d-flex align-items-center">
                        <div className="d-flex align-items-center justify-content-center me-2" style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '6px'
                        }}>
                          <i className="fas fa-map-marker-alt text-secondary" style={{ fontSize: '18px' }}></i>
                        </div>
                        Distrito
                      </label>
                      <select
                        className="form-select border-2 shadow-sm"
                        name="district"
                        value={settingsForm.district || ""}
                        onChange={handleInputChange}
                        style={{
                          borderRadius: '18px',
                          borderColor: '#e9ecef',
                          backgroundColor: '#fff',
                          padding: '12px 16px',
                          fontSize: '18px',
                          transition: 'all 0.2s ease'
                        }}
                        disabled={!settingsForm.city}
                        onFocus={(e) => !e.target.disabled && (e.target.style.borderColor = '#667eea')}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      >
                        <option value="">
                          {settingsForm.city ? "Seleccione un distrito" : "Primero seleccione una ciudad"}
                        </option>
                        {settingsForm.city && citiesWithDistricts[settingsForm.city] &&
                          citiesWithDistricts[settingsForm.city].map((district, index) => (
                            <option key={`district-${index}`} value={district}>
                              {district}
                            </option>
                          ))
                        }
                      </select>
                    </div>


                    <div className="col-md-10">
                      <label className="form-label fw-medium">Dirección</label>
                      <input
                        type="text"
                        name='address'
                        className="form-control form-control-lg border-employee"
                        value={settingsForm.address}
                        onChange={handleInputChange}
                        maxLength={40}
                        placeholder="Av. Principal 123"
                      />
                    </div>

                    {/* Información Profesional */}
                    <div className="col-12 mt-5">
                      <h5 className="mb-3 d-flex align-items-center">
                        <Briefcase size={20} className="me-2 text-primary" />
                        Información Profesional
                      </h5>
                    </div>

                    {/* Información de la cobertura 
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Cobertura de Servicios</label>
                        <div className="d-flex mb-2">
                          <input
                            type="text"
                            className="form-control form-control-lg border-employee me-2"
                            placeholder="Escribe un distrito"
                            value={districtInput}
                            onChange={(e) => setDistrictInput(e.target.value)}
                          />
                          <button type="button" className="btn btn-primary" onClick={addDistrict}>
                            Agregar
                          </button>
                        </div>
                        {settingsForm.coverage.length > 0 && (
                          <ul className="list-group">
                            {settingsForm.coverage.map((district, index) => (
                              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                {district}
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                  onClick={() => removeDistrict(index)}
                                >
                                  Eliminar
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      */}
                    {/* Servicios prueba */}

                    <div className="col-md-6">
                      <label className="form-label fw-medium">Cobertura de Servicios</label>

                      {/* Ciudad */}
                      <select
                        className="form-select mb-2"
                        value={selectedCity}
                        onChange={handleCityChange}
                      >
                        <option value="">Selecciona una ciudad</option>
                        {Object.keys(citiesWithDistricts).map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>

                      {/* Distrito (se filtra por ciudad) */}
                      <div className="d-flex mb-2">
                        <select
                          className="form-select me-2"
                          value={selectedDistrict}
                          onChange={handleDistrictChange}
                          disabled={!selectedCity}
                        >
                          <option value="">Selecciona un distrito</option>
                          {selectedCity &&
                            citiesWithDistricts[selectedCity]?.map((district) => (
                              <option key={district} value={district}>
                                {district}
                              </option>
                            ))}
                        </select>

                        <button type="button" className="btn btn-primary" onClick={addDistrict}>
                          Agregar
                        </button>
                      </div>

                      {/* Lista de distritos agregados */}
                      {settingsForm.coverage.length > 0 && (
                        <ul className="list-group">
                          {settingsForm.coverage.map((district, index) => (
                            <li
                              key={index}
                              className="list-group-item d-flex justify-content-between align-items-center"
                            >
                              {district}
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => removeDistrict(index)}
                              >
                                Eliminar
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Servicios Específicos */}
                    <h2>Agregar Servicios</h2>
                    {services.map((service, index) => (
                      <div key={index} style={{ marginBottom: "15px", border: "1px solid #ddd", padding: "10px", borderRadius: "5px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                          <h5>Servicio {index + 1}</h5>
                          {services.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeService(index)}
                              style={{
                                backgroundColor: "#dc3545",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                padding: "5px 10px",
                                cursor: "pointer"
                              }}
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="Nombre del servicio"
                          value={service.name}
                          onChange={(e) => handleChange(index, "name", e.target.value)}
                          required
                          style={{ width: "100%", padding: "8px", marginBottom: "5px" }}
                        />
                        <textarea
                          placeholder="Descripción del servicio"
                          value={service.description}
                          onChange={(e) => handleChange(index, "description", e.target.value)}
                          required
                          style={{ width: "100%", padding: "8px" }}
                        ></textarea>
                      </div>
                    ))}
                    <button type="button" className="btn btn-primary" onClick={addService}>Agregar otro servicio</button>

                    {/* Botones de acción */}
                    <div className="col-12 mt-5">
                      <div className="d-flex gap-3 justify-content-end">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg px-4 d-flex align-items-center"
                        >
                          <Save size={18} className="me-2" />
                          Guardar Cambios
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      );
    };
    // Contenido por defecto para otras secciones
    return (
      <div className="container-fluid px-4">
        <div className="row">
          <div className="card border-0 shadow-sm" style={{ minHeight: '500px', borderRadius: '15px' }}>
            <div className="card-body d-flex align-items-center justify-content-center">
              <div>

                {/* Header Section */}
                <div className="row mb-5 p-2" style={{ width: "800px" }}>
                  <div className="p-2">
                    <div className="card border-0 shadow-lg" style={{
                      background: '#667eea',
                      //width: '800px',
                      borderRadius: '20px'
                    }}>
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="position-relative">
                            <img
                              src={settingsForm.photo}
                              alt="Avatar"
                              className="rounded-circle border border-white border-3"
                              width="80"
                              height="80"
                              style={{ objectFit: 'cover' }}
                            />
                            <div
                              className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-white"
                              style={{ width: '20px', height: '20px' }}
                            ></div>
                          </div>
                          <div className="ms-4 text-white">
                            <h2 className="mb-1 fw-bold">¡Hola, {employeeData.name}! 👋</h2>
                            <p className="mb-0 opacity-75">Bienvenido de vuelta. ¿En qué podemos ayudarte hoy?</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* verificar cuenta */}
                <div className="row mb-5">
                  <div className="col-12">
                    <div
                      className="card border-0 shadow-lg"
                      style={{
                        borderRadius: '20px',
                      }}
                    >
                      <div className="card-body p-0">
                        <Stack spacing={0} sx={{ width: '100%' }}>
                          <Alert
                            severity="warning"
                            variant="outlined"
                            sx={{
                              borderRadius: '20px',
                              border: "2px solid",
                              padding: '16px 20px',
                              borderColor: '#f5b041', // color personalizado del borde
                              color: '#000',
                            }}
                            action={
                              <Button
                                size="medium"
                                variant="outlined"
                                sx={{
                                  fontWeight: 'bold',
                                  borderRadius: '10px',
                                  border: "2px solid",
                                  color: '#000',
                                  borderColor: '#f5b041', // mismo color que el alert
                                  '&:hover': {
                                    borderColor: '#d4ac0d',
                                    backgroundColor: '#fef9e7',
                                  },
                                }}
                              >
                                VERIFICAR
                              </Button>
                            }
                          >
                            Tu cuenta aún no está verificada. Verifícala ahora para poder pedir servicios.
                          </Alert>
                        </Stack>
                      </div>
                    </div>
                  </div>
                </div>


                {solicitudes.length > 0 && (
                  <div className="row mb-5">
                    <div className="col-12">
                      <div className="card border-0 shadow-lg" style={{
                        borderRadius: '20px',
                        background: '#7B55D9'
                      }}>
                        <div className="card-body p-4">
                          <div className="d-flex align-items-center mb-4">
                            <div className="rounded-3 p-3 me-3" style={{ background: "#9E8ADB" }}>
                              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="mb-0 text-white">Solicitudes</h3>
                              <p className="text-muted mb-0">Total: {solicitudes.length} solicitudes</p>
                            </div>
                          </div>
                          <div className="row g-4">
                            {solicitudes.map((e) => (
                              <div key={e._id} className="col-lg-4 col-md-6">
                                <div
                                  className="card h-100 border-0 shadow-sm bg-white hover-card"
                                  style={{
                                    borderRadius: '15px',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                      {/* LADO IZQUIERDO */}
                                      <div className="me-3">
                                        <p className="text-muted fw-semibold mb-1">Cliente:</p>
                                        <p className="text-dark mb-2">{e.customerNombre}</p>
                                        <p className="text-muted fw-semibold mb-1">Servicio:</p>
                                        <p className="text-dark mb-0">{e.service}</p>
                                      </div>
                                      {/* LADO DERECHO */}
                                      <div className="text-end d-flex flex-column align-items-center">
                                        <span className="badge bg-success rounded-pill mb-2 px-3 py-2">
                                          <i className="fas fa-star me-1"></i> {e.customerStar}
                                        </span>
                                        <div
                                          style={{
                                            width: '80px',
                                            height: '80px',
                                            overflow: 'hidden',
                                            borderRadius: '50%',
                                          }}
                                        >
                                          <img
                                            src={e.customerFoto}
                                            alt="Foto cliente"
                                            width="80"
                                            height="80"
                                            style={{ objectFit: 'cover' }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <hr />
                                    <div className="me-3" style={{ height: "100px" }}>
                                      <p className="text-muted fw-semibold mb-1">Descripción:</p>
                                      <p className="text-dark mb-2">{e.comment}</p>
                                    </div>
                                    <div className="d-flex justify-content-evenly">
                                      <button className="btn btn-outline-primary btn-sm rounded-pill px-4"
                                        onClick={() => aceptarSolicitud(e.customerId, e._id)}>
                                        Aceptar
                                      </button>
                                      <button className="btn btn-outline-danger btn-sm rounded-pill px-4"
                                        onClick={() => handleRechazarServicio(e.customerId, e.employeeId, e.service, e._id)}>
                                        Rechazar
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {serviceRun.length > 0 && (
                  <div className="row mb-5">
                    <div className="col-12">
                      <div
                        className="card border-0 shadow-lg"
                        style={{
                          borderRadius: '20px',
                          background: '#6fb288', // color de fondo del contenedor grande
                          padding: '20px'
                        }}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-4">
                            <div className="rounded-3 p-3 me-3" style={{ background: "#2196F3" }}>
                              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                                <path d="M9 2a7 7 0 0 1 6.93 6H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h4.07A7 7 0 0 1 9 2zM4 10v9h16v-9H4zm5-6a5 5 0 0 0 0 10a5 5 0 0 0 0-10z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="mb-0">Servicios en Curso</h3>
                              <p className="text-muted mb-0">Tienes {serviceRun.length} servicio(s) activo(s)</p>
                            </div>
                          </div>

                          {/* Tarjetas en fila */}
                          <div className="d-flex flex-wrap gap-4 justify-content-start">
                            {serviceRun.map((element, index) => (
                              <div
                                key={element._id}
                                className="card border-0 shadow-sm"
                                style={{
                                  borderRadius: '15px',
                                  width: '48%',
                                  minWidth: '300px',
                                  maxWidth: '100%',
                                  display: 'flex',
                                  backgroundColor: '#E3F2FD',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between'
                                }}
                              >
                                {/* Cuerpo con imagen + info */}
                                <div className="d-flex p-3" style={{ gap: '1rem' }}>
                                  <div
                                    style={{
                                      width: '100px',
                                      height: '100px',
                                      borderRadius: '50%',
                                      overflow: 'hidden',
                                      flexShrink: 0
                                    }}
                                  >
                                    <img
                                      src={element.photo}
                                      alt="Foto"
                                      width="100"
                                      height="100"
                                      style={{ objectFit: 'cover' }}
                                    />
                                  </div>
                                  <div className="flex-grow-1 d-flex flex-column justify-content-center">
                                    <p className="fw-bold mb-1">Cliente: {element.name}</p>
                                    <p className="text-muted mb-0">Servicio en progreso con este usuario.</p>
                                  </div>
                                </div>

                                <div className="card-footer bg-transparent text-center pb-3">
                                  <button className="btn btn-primary btn-sm rounded-pill px-4"
                                    onClick={() => {
                                      setServicioSeleccionado(element)
                                      setShowPopup(true);
                                    }}

                                  >
                                    Finalizar Servicio
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container-spinner">
        <div className="spinner"></div>
        <p>cargando...</p>
      </div>
    );
  }
  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      <style>{`
        .btn-ghost:hover {
          background-color: #f8f9fa;
        }
        .btn-ghost {
          border: none;
          background: transparent;
        }
        .sidebar-desktop {
          width: 250px;
          border: 1px solid black;
        }
         /* SIDEBAR DERECHO MÁS ANCHO */
        .sidebar-desktop-right {
          width: 350px;
        }
        .employee-sidebar {
          background: white;
        }
        
      `}</style>

      <style>{`
        .btn-ghost:hover {
    background-color: #f8f9fa;
  }
  .btn-ghost {
    border: none;
    background: transparent;
  }
  .sidebar-desktop {
    width: 250px;
  }
  
  /* SIDEBAR DERECHO MÁS ANCHO */
  .sidebar-desktop-right {
    width: 350px;
  }
  
  /* CONTENIDO PRINCIPAL CENTRADO CON NUEVAS MEDIDAS */
  .main-content {
    margin-left: 250px;  /* Espacio para sidebar izquierdo */
    margin-right: 350px; /* Espacio para sidebar derecho (ahora más ancho) */
    transition: margin 0.3s ease;
  }
  
  /* Para pantallas medianas (tablets) */
  @media (max-width: 1199.98px) {
    .main-content {
      margin-left: 0;
      margin-right: 0;
    }
  }
  
  /* Para pantallas pequeñas (móviles) */
  @media (max-width: 991.98px) {
    .main-content {
      margin-left: 0;
      margin-right: 0;
    }
  }
  
  /* Ajustes adicionales para mejor responsividad */
  @media (min-width: 992px) and (max-width: 1199.98px) {
    .sidebar-desktop {
      width: 200px;
    }
    .sidebar-desktop-right {
      width: 280px;
    }
    .main-content {
      margin-left: 200px;
      margin-right: 280px;
    }
  }
  
  /* Para pantallas muy grandes */
  @media (min-width: 1400px) {
    .main-content {
      margin-left: 250px;
      margin-right: 350px;
      max-width: none;
    }
  }
  
  .table-hover tbody tr:hover {
    background-color: #f8f9fa;
  }
  }
      `}</style>
      <div className="min-h-screen">
        {/* Sidebar Desktop */}
        <div className="position-fixed top-0 start-0 h-100 shadow-lg d-none d-lg-block sidebar-desktop employee-sidebar" style={{ zIndex: 1000 }}>
          {/* Logo y Perfil del Empleado */}
          <div className="p-4">
            <div className="d-flex align-items-center">
              <div>
                <h6 className="mb-0" style={{ fontSize: "40px", fontWeight: "bold", marginTop: "15px", color: "#3a88fe" }}>ServiGO</h6>
                <small className="text-muted">employee</small>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <nav className="px-3 pb-3">
            <div className="mb-3">
              <small className="text-light opacity-75 fw-medium text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px' }}>
              </small>
            </div>
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={`item-${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={`btn w-100 text-start mb-1 d-flex align-items-center text-black menu-item ${activeSection === item.id ? 'menu-item-active' : ''
                    }`}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: '12px 16px',
                    borderRadius: '8px'
                  }}
                >
                  <Icon size={18} className="me-3" />
                  <span style={{ fontSize: '14px' }}>{item.label}</span>
                  {item.id === 'jobs' && employeeData.activeJobs > 0 && (
                    <span className="badge bg-warning text-dark ms-auto" style={{ fontSize: '10px' }}>
                      {employeeData.activeJobs}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Derecho (Desktop) */}
        <div className="position-fixed top-0 end-0 h-100 shadow-lg d-none d-lg-block sidebar-desktop-right" style={{ zIndex: 1000, backgroundColor: "#f8f9fa" }}>
          <div className="p-4">
            <div className="d-flex align-items-center justify-content-center">
              <div className="text-center">
                <div className="d-flex align-items-center">
                  {/* User Menu Dropdown */}
                  <div className="position-relative dropdown-container">
                    <button
                      className=" d-flex align-items-center"
                      style={{ border: "none", fontSize: "18px" }}
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      <span className="d-none d-md-inline">"rogrigo"</span>
                      <div className="p-1">
                        <div className="position-relative">
                          <img
                            src="foto p"
                            alt="Avatar"
                            className="rounded-circle border border-white border-3"
                            width="50"
                            height="50"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      </div>
                    </button>

                    {showUserMenu && (
                      <div className="position-absolute top-100 end-0 mt-2 bg-white border rounded shadow-lg" style={{ width: '250px', zIndex: 1050 }}>
                        <div className="p-3 border-bottom">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary rounded-circle p-2 me-2">
                              <User size={16} className="text-white" />
                            </div>
                            <div>
                              <div className="fw-medium small">"rodrigo"</div>
                              <small className="text-muted" style={{ fontSize: "13px" }}>"rodrigo43@gmail.com"</small>
                            </div>
                          </div>
                        </div>
                        <div className="p-1">
                          <button
                            className="btn btn-ghost w-100 text-start d-flex align-items-center p-2"
                            onClick={() => {
                              setActiveSection('settings');
                              setShowUserMenu(false);
                            }}
                          >
                            <Users size={16} className="me-2" />
                            Perfil
                          </button>
                          <button className="btn btn-ghost w-100 text-start d-flex align-items-center p-2">
                            <Settings size={16} className="me-2" />
                            Configuración
                          </button>
                          <button className="btn btn-ghost w-100 text-start d-flex align-items-center p-2">
                            <Bell size={16} className="me-2" />
                            Notificaciones
                          </button>
                          <hr className="my-1" />
                          <button className="btn btn-ghost w-100 text-start d-flex align-items-center p-2 text-danger">
                            <LogOut size={16} className="me-2" />
                            Cerrar Sesión
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <nav className="p-3">
            {/* Estadísticas */}
            <div className="mb-3">
              <Card variant="outlined" sx={{ borderRadius: '16px', boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Contactos
                  </Typography>
                  <List>
                    {chatsCerrados.map((chat, index) => {
                      const estaActivo = chatsActivos.some(c => c.roomId === chat.roomId);
                      return (
                        <React.Fragment key={chat.roomId}>
                          <ListItem
                            alignItems="flex-start"
                            sx={{
                              cursor: estaActivo ? 'default' : 'pointer',
                              opacity: estaActivo ? 0.5 : 1,
                              transition: 'none',
                            }}
                            onClick={
                              estaActivo
                                ? undefined // Si ya está activo, no vuelve a hacer nada
                                : async () => {
                                  try {
                                    const response = await axios.get(`http://localhost:4500/message/history/${chat.roomId}`);
                                    const historial = response.data;

                                    setChatsActivos(prev => [...prev, chat]);

                                    setMensajesPorSala(prev => ({
                                      ...prev,
                                      [chat.roomId]: historial
                                    }));
                                  } catch (err) {
                                    console.error('Error al cargar historial:', err);
                                  }
                                }
                            }
                          >
                            <ListItemAvatar>
                              <Avatar src={chat.fotoUrl} />
                            </ListItemAvatar>
                            <ListItemText
                              primary={chat.destinatario}
                              secondary={
                                estaActivo
                                  ? 'employee'
                                  : 'employee'
                              }
                            />
                          </ListItem>
                          {index < chatsCerrados.length - 1 && <Divider component="li" />}
                        </React.Fragment>
                      );
                    })}
                  </List>
                </CardContent>
              </Card>
            </div>

            {/* Actividad Reciente */}
            <div className="mb-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-3">
                  <h6 className="card-title mb-2 d-flex align-items-center">
                    <Clock size={18} className="me-2 text-info" />
                    Actividad Reciente
                  </h6>
                  <div className="small">
                    <div className="mb-2 pb-2 border-bottom">
                      <div className="sidebar-chats" style={{ cursor: "pointer" }}>

                      </div>
                    </div>
                    <div className="mb-2 pb-2 border-bottom">
                      <div className="fw-medium">Nueva reserva</div>
                      <div className="text-muted">Hace 4 horas</div>
                    </div>
                    <div>
                      <div className="fw-medium">Mensaje recibido</div>
                      <div className="text-muted">Hace 6 horas</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </nav>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
            style={{ zIndex: 999 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div className={`position-fixed top-0 start-0 h-100 text-white shadow-lg d-lg-none employee-sidebar ${sidebarOpen ? '' : 'd-none'}`} style={{ width: '280px', zIndex: 1000 }}>

          <nav className="p-3">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={`mobile-${item.id}`}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`btn w-100 text-start mb-2 d-flex align-items-center text-white ${activeSection === item.id ? 'bg-white bg-opacity-20' : ''
                    }`}
                  style={{ border: 'none', background: activeSection === item.id ? 'rgba(255,255,255,0.2)' : 'transparent' }}
                >
                  <Icon size={40} color="#3a88fe" strokeWidth={1.5} className="me-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Header */}
          <header className="bg-white shadow-sm py-4 mt-4"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            borderBottom: '1px solid #ddd'
          }}>
            <div className="container">
              <div className="d-flex justify-content-between align-items-center">
                <button
                  className="btn btn-outline-secondary d-lg-none"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  style={{ borderRadius: '8px' }}
                >
                  <Menu size={20} />
                </button>
              </div>

              <div className="d-flex align-items-center">


                {/* User Menu Dropdown */}
                <div className="position-relative dropdown-container">
                  {showUserMenu && (
                    <div className="position-absolute top-100 end-0 mt-2 bg-white border rounded-4 shadow-lg" style={{ width: '280px', zIndex: 1050 }}>
                      <div className="p-3 border-bottom">
                        <div className="d-flex align-items-center">
                          <img
                            src={settingsForm.photo}
                            alt="Perfil"
                            className="rounded-circle me-3"
                            width="48"
                            height="48"
                          />
                          <div className="flex-grow-1">
                            <div className="fw-medium">{employeeData.name}</div>
                            <small className="text-muted d-block">{employeeData.email}</small>
                          </div>
                        </div>
                      </div>
                      <div className="p-1">
                        <button className="btn btn-ghost w-100 text-start d-flex align-items-center p-2">
                          <UserCircle size={16} className="me-3 text-primary" />
                          <div>
                            <div className="fw-medium small">Mi Perfil</div>
                            <small className="text-muted">Ver y editar información</small>
                          </div>
                        </button>
                        <button className="btn btn-ghost w-100 text-start d-flex align-items-center p-2">
                          <Settings size={16} className="me-3 text-secondary" />
                          <div>
                            <div className="fw-medium small">Configuración</div>
                            <small className="text-muted">Preferencias y ajustes</small>
                          </div>
                        </button>
                        <hr className="my-1" />
                        <button className="btn btn-ghost w-100 text-start d-flex align-items-center p-2 text-danger">
                          <LogOut size={16} className="me-3" />
                          <div>
                            <div className="fw-medium small">Cerrar Sesión</div>
                            <small className="text-muted">Salir de la aplicación</small>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navegación principal - Desktop */}
                <div className="d-none d-lg-flex justify-content-center flex-grow-1">
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ width: '750px' }}
                  >
                    <Home size={35} strokeWidth={2} className="text-primary" style={{ cursor: 'pointer' }} />
                    <Users size={35} strokeWidth={2} className="text-primary" style={{ cursor: 'pointer' }} />
                    <Store size={35} strokeWidth={2} className="text-primary" style={{ cursor: 'pointer' }} />
                    <Search size={35} strokeWidth={2} className="text-primary" style={{ cursor: 'pointer' }} />
                    <Bell size={35} strokeWidth={2} className="text-primary" style={{ cursor: 'pointer' }} />
                    <MessageCircleMore size={35} strokeWidth={2} className="text-primary" style={{ cursor: 'pointer' }} />
                  </div>
                </div>

              </div>
            </div>
          </header>

          {/* Área de Contenido */}
          {renderMainContent()}
        </div>
      </div>

      {/* Modal para solicitar servicio */}
      <RejectionRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        employeeId={employeeId}
        customerId={customerId}
        service={servicio}
        serviceId={serviceId}
        setSolicitudes={setSolicitudes}
      />
      {/* chatbox */}
      {chatsActivos.map((chat, index) => (
        <ChatBox
          key={chat.roomId}
          roomId={chat.roomId}
          usuarioId={chat.usuarioId}
          remitente={chat.remitente}
          visible={true}
          destinatario={chat.destinatario}
          imageUrl={chat.fotoUrl}
          setVisible={() => {
            const chatCerrado = {
              roomId: chat.roomId,
              usuarioId: chat.usuarioId,
              destinatario: chat.destinatario,
              remitente: chat.remitente,
              fotoUrl: chat.fotoUrl,
            }
            setChatsActivos(prev => prev.filter(c => c.roomId !== chat.roomId));
            setChatsCerrados(prev => [chatCerrado, ...prev]);

            axios.post(`http://localhost:4500/users/chats-close`, chatCerrado)
              .catch(err => console.error('Error al guardar chat cerrado:', err));
          }}
          style={{ right: 20 + index * 340 }}
          mensajesIniciales={mensajesPorSala[chat.roomId] || []}
          onMensajesUpdate={(roomId, nuevosMensajes) => {
            setMensajesPorSala(prev => ({
              ...prev,
              [roomId]: nuevosMensajes
            }));
          }}
        />
      ))}
      {showPopup && (
        <ReviewPopup
          servicio={servicioSeleccionado}
          onClose={() => setShowPopup(false)}
          serviceRun={serviceRun}
          setServiceRun={setServiceRun}
          userType='employee'
        />
      )}

    </>
  );
};

export default EmployeeDashboard;