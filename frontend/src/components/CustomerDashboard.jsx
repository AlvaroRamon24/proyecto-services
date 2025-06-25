import React, { useState, useEffect } from 'react';
import {
  User,
  Bell,
  Search,
  Menu,
  X,
  Home,
  BarChart3,
  Users,
  Settings,
  Video,
  MessageCircleMore,
  CreditCard,
  Clock,
  Zap,
  ShoppingBag,
  TrendingUp,
  Store,
  DollarSign,
  Activity,
  Calendar,
  MessageCircle,
  HelpCircle,
  Mail,
  Phone,
  LogOut,
  UserCircle,
  Table,
  Edit,
  UserRoundSearch,
  Trash2,
  Eye,
  Plus,
  Filter
} from 'lucide-react';
import axios from 'axios';
import { useParams, Outlet } from 'react-router-dom';
import '../App.css';
import ChatBox from './ChatBox.jsx';
import socket from '../socket';
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
  Huancayo: ["Chilca", "El Tambo", "San Agustín de Cajas"],
  Tacna: ["Alto de la Alianza", "Calana", "Ciudad Nueva", "Inclán", "Pachía", "Palca", "Pocollay"],
};

const CustomerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [data, setData] = useState({});
  const [employeeData, setEmployeeData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [serviceRun, setServiceRun] = useState([]);// servicio en curso
  const [fotoUrl, setFotoUrl] = useState('');
  const [nombreOtroUsuario, setNombreOtroUsuario] = useState('');
  const { id } = useParams();
  //prueba chat
  const [chatVisible, setChatVisible] = useState(false);
  const [roomId, setRoomId] = useState(null);
  //prueba chat multiples
  const [chatsActivos, setChatsActivos] = useState([]);
  //
  const [reject, setReject] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: '',
    document: "",
    address: "",
    city: data.city || "",
    district: "",
    phone: "",
    isActive: true,
    photo: "",
  });

  // Datos simulados
  const stats = [
    {
      title: 'Ingresos Totales',
      value: '$45,231',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'success'
    },
    {
      title: 'Nuevos Clientes',
      value: '2,340',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'primary'
    },
    {
      title: 'Pedidos',
      value: '1,256',
      change: '-2.4%',
      trend: 'down',
      icon: ShoppingBag,
      color: 'warning'
    },
    {
      title: 'Tasa Conversión',
      value: '3.24%',
      change: '+1.8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'info'
    }
  ];

  const notifications = [
    { id: 1, title: 'Nuevo pedido recibido', message: 'Pedido #1234 por $150.00', time: '5 min', unread: true },
    { id: 2, title: 'Pago confirmado', message: 'Pago de cliente Juan Pérez', time: '15 min', unread: true },
    { id: 3, title: 'Stock bajo', message: 'Producto XYZ tiene pocas unidades', time: '1 hora', unread: false },
    { id: 4, title: 'Nuevo mensaje', message: 'Consulta de cliente María García', time: '2 horas', unread: true },
    { id: 5, title: 'Reporte listo', message: 'Reporte mensual disponible', time: '1 día', unread: false }
  ];

  const recentActivity = [
    { id: 1, action: 'Nuevo pedido recibido', time: 'Hace 5 min', type: 'order' },
    { id: 2, action: 'Cliente registrado', time: 'Hace 12 min', type: 'user' },
    { id: 3, action: 'Pago procesado', time: 'Hace 25 min', type: 'payment' },
    { id: 4, action: 'Producto actualizado', time: 'Hace 1 hora', type: 'product' },
    { id: 5, action: 'Reporte generado', time: 'Hace 2 horas', type: 'report' }
  ];

  const cliente = {
    nombre: 'María López',
    avatar: 'https://i.pravatar.cc/150?img=47',
  };

  const recomendados = [
    { id: 1, nombre: 'Juan Pérez', servicio: 'Plomería', rating: 4.9 },
    { id: 2, nombre: 'Ana Torres', servicio: 'Limpieza', rating: 4.8 },
  ];

  const solicitudes = [
    { id: 1, servicio: 'Electricista', estado: 'Pendiente' },
    { id: 2, servicio: 'Gasfitería', estado: 'Aceptado' },
  ];

  const favoritos = [
    { id: 1, nombre: 'Carlos Méndez', servicio: 'Pintura' },
    { id: 2, nombre: 'Sofía Ramírez', servicio: 'Jardinería' },
  ];
  const menuItems = [
    { id: 'overview', label: 'Panel Principal', icon: Home },
    { id: 'analytics', label: 'Analíticas', icon: BarChart3 },
    { id: 'customers', label: 'Buscar Servicio', icon: UserRoundSearch },
    { id: 'tables', label: 'Tablas', icon: Table },
    { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
    { id: 'payments', label: 'Pagos', icon: CreditCard },
    { id: 'settings', label: 'Editar Perfil', icon: Settings }
  ];

  //socket connect
  useEffect(() => {
    // Conexión inicial: registramos el ID del trabajador
    socket.emit('register_customer', id);
    // Obtener solicitudes pasadas desde la API
    axios.get(`http://localhost:4500/solicitud/customer/${id}`)
      .then(res => setReject(res.data))
      .catch(console.error);
    // Escuchar solicitudes nuevas en tiempo real
    socket.on('reject_solicitud', (nueva) => {
      setReject(prev => [nueva, ...prev]);
    });
    // Cleanup al desmontar
    return () => {
      socket.off('reject_solicitud');
    };
  }, [id]);

  //----chat prueba
  // 1) Efecto que oye chat_iniciado y muestra el chat
  useEffect(() => {
    const handleChatIniciado = async ({ roomId, customerId, employeeId }) => {
      socket.emit('join_chat', { customerId, employeeId, isInitiator: false });
      const userId = id === customerId ? employeeId : customerId;

      try {
        const res = await axios.get(`http://localhost:4500/solicitud/usuario/${userId}`);
        const nombre = res.data.nombre;
        const fotoUrl = res.data.photoUrl || 'https://i.pravatar.cc/150?img=47';

        setChatsActivos((prev) => {
          const exist = prev.some((chat) => chat.roomId === roomId);
          if (exist) return prev;

          return [
            ...prev, {
              roomId,
              usuarioId: id, // ID del cliente actual
              remitente: formData.name, // Nombre del cliente actual
              destinatario: nombre, // Nombre del otro usuario
              fotoUrl: fotoUrl, // URL de la foto del otro usuario
            }
          ]
        })
      } catch (error) {
        console.error('Error obteniendo nombre del otro usuario:', error);
      }
    };

    socket.on('chat_iniciado', handleChatIniciado);
    return () => socket.off('chat_iniciado', handleChatIniciado);
  }, [id]);                     // ← tu dependencia actual


  useEffect(() => {
    const handleServicioProceso = async ({ customerId, employeeId, roomId }) => {
      const userId = id === customerId ? employeeId : customerId;
      try {
        const searchInfoUser = await axios.get(`http://localhost:4500/solicitud/usuario/${userId}`);
        setServiceRun((prev) => [...prev, searchInfoUser.data]);
      } catch (error) {
        console.error('Error obteniendo informacion del usuario:', error);
      }
    }

    socket.on('mostrar_servicio_en_proceso', handleServicioProceso);

    return () => {
      socket.off('mostrar_servicio_en_proceso', handleServicioProceso);
    };
  }, [id])

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

  // eliminar reject customer
  const handleDeleteReject = async (solicitudId) => {
    try {
      const response = await axios.post(`http://localhost:4500/solicitud/delete/${solicitudId}`)
      if (response.status === 200) {
        // Volver a obtener todas las solicitudes actualizadas
        const updatedRejects = await axios.get(`http://localhost:4500/solicitud/customer/${id}`);
        setReject(updatedRejects.data);
      }
    } catch (error) {
      console.error('Error al eliminar el reject', error);
    }
  }

  useEffect(() => {
    const apiConnectCustomer = async () => {
      try {
        const response = await axios(`http://localhost:4500/customer/${id}`);
        if (response.status === 200) {
          setData(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error al conectar a la API:', error);
      }
    }
    apiConnectCustomer();
  }, [id]);

  useEffect(() => {
    const getDataCustomer = async () => {
      try {
        const response = await axios("http://localhost:4500/employee/");
        if (response.status === 200) {
          setEmployeeData(response.data);
        }
      } catch (error) {
        console.error('Error al conectar a la API:', error);
      }
    }
    getDataCustomer();
  }, [])

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setFormData({
        name: data.name || "",
        lastName: data.lastName || "",
        email: data.email || '',
        document: data.document || "",
        address: data.address || "",
        city: data.city || "",
        district: data.district || "",
        phone: data.phone || "",
        isActive: data.isActive ?? true,
        photo: data.photo || "",
      });
    }
  }, [data]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData((prev) => ({
          ...prev,
          photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if ((name === "name" || name === "lastName") && /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(value)) {
      return; // Ignora si no es letra o espacio
    }
    if ((name === "document" || name === "phone") && /[^\d]/.test(value)) {
      return; // Ignora si no es un número (dígito)
    }

    // Si cambia la ciudad, resetear el distrito
    if (name === 'city') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
        district: "" // Resetear distrito cuando cambie la ciudad
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };


  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    const dataToUpdate = {
      ...formData,
      photo: previewImage,
    }
    try {
      const response = await axios.put(`http://localhost:4500/customer/update/${id}`, dataToUpdate);
      if (response.status === 200) {
        alert('Información actualizada correctamente');
        setData(response.data);
        //setPreviewImage(null); // Reset preview image
      }
    } catch (error) {
      console.error('Error al actualizar la información:', error);
      alert('Error al actualizar la información');
    }
  }
  const renderTableContent = () => {
    return (
      <div className="container-fluid px-4">
        {/* Header de la sección */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-1">Gestión de Usuarios</h4>
                <p className="text-muted mb-0">Administra y visualiza la información de todos los usuarios</p>
              </div>
              <button className="btn btn-primary d-flex align-items-center">
                <Plus size={18} className="me-2" />
                Nuevo Usuario
              </button>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control ps-5"
                        placeholder="Buscar usuarios..."
                      />
                      <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <select className="form-select">
                      <option value="">Todos los estados</option>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="pendiente">Pendiente</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <button className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center">
                      <Filter size={18} className="me-2" />
                      Filtros
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de trabajadores */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 d-flex align-items-center">
                    <Table size={18} className="me-2 text-primary" />
                    Lista de Trabajadores ({employeeData.length})
                  </h6>
                  <div className="d-flex align-items-center">
                    <small className="text-muted me-3">Mostrando {employeeData.length} de {employeeData.length} usuarios</small>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0 py-3">ID</th>
                        <th className="border-0 py-3">Usuario</th>
                        <th className="border-0 py-3">Contacto</th>
                        <th className="border-0 py-3">Ciudad</th>
                        <th className="border-0 py-3">Distrito</th>
                        <th className='border-0 py-3'>Servicios</th>
                        <th className="border-0 py-3">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeData.map((user, index) => (
                        <tr key={`employee-${user._id}`}>
                          <td className="py-3">
                            <span className="badge bg-light text-dark">{index + 1}</span>
                          </td>
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                <User size={16} className="text-primary" />
                              </div>
                              <div>
                                <div className="fw-medium">{user.name}</div>
                                <small className="text-muted">{user.role}</small>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="d-flex align-items-center text-muted small">
                              <Phone size={14} className="me-1" />
                              {user.phone}
                            </div>
                            <div className="d-flex align-items-center text-muted small mt-1">
                              <Mail size={14} className="me-1" />
                              {user.email}
                            </div>
                          </td>
                          <td className="py-3">{user.city}</td>
                          <td className="py-3">
                            <small className="text-muted">{user.district}</small>
                          </td>
                          <td className="py-3">
                            {user.services && typeof user.services === 'object' ? (
                              <ul className="text-muted">
                                {Object.entries(user.services).map(([key, value], index) => (
                                  <li key={`${user.id}-${key}-${index}`}>{key}</li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-muted">Sin servicios</span>
                            )}
                          </td>
                          <td className="py-3">
                            <span className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}>
                              {user.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">Página 1 de 1</small>
                  <nav>
                    <ul className="pagination pagination-sm mb-0">
                      <li className="page-item disabled">
                        <span className="page-link">Anterior</span>
                      </li>
                      <li className="page-item active">
                        <span className="page-link">1</span>
                      </li>
                      <li className="page-item disabled">
                        <span className="page-link">Siguiente</span>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderApiTable = () => {
    return (
      <Outlet context={{ id }} />
    )
  }
  const renderFormCustomer = () => {
    return (
      <div className="container-fluid px-3 py-3" style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh',
        overflow: 'auto'
      }}>
        <div className="row justify-content-center">
          <div className="col-12 col-xl-11">
            <div className="card border-0 shadow-lg" style={{
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)'
            }}>
              <div className="card-body p-4 p-md-5">
                {/* Header Section - Mejorado */}
                <div className="border-bottom pb-4 mb-4">
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center justify-content-center me-4" style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '16px',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                    }}>
                      <i className="fas fa-user-edit text-white fs-4"></i>
                    </div>
                    <div>
                      <h3 className="fw-bold text-dark mb-2">Editar Cliente</h3>
                      <p className="text-muted mb-0">Actualiza la información del perfil del cliente</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmitUpdate}>
                  <div className="row g-4">

                    {/* Foto de Perfil - Mejorada */}
                    <div className="col-12 col-lg-4">
                      <div className="card border-0 shadow-sm h-100" style={{
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                      }}>
                        <div className="card-body p-4 d-flex flex-column justify-content-between">
                          <div className="text-center mb-4">
                            <h6 className="fw-bold text-dark mb-4 d-flex align-items-center justify-content-center">
                              <div className="d-flex align-items-center justify-content-center me-2" style={{
                                width: '32px',
                                height: '32px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '8px'
                              }}>
                                <i className="fas fa-camera text-white" style={{ fontSize: '14px' }}></i>
                              </div>
                              Foto de Perfil
                            </h6>

                            <div className="position-relative d-inline-block mb-4">
                              {formData.photo && formData.photo.trim() !== '' ? (
                                <img
                                  src={data.photo}
                                  alt="Vista previa"
                                  className="shadow-lg"
                                  style={{
                                    width: '140px',
                                    height: '140px',
                                    objectFit: 'cover',
                                    borderRadius: '20px',
                                    border: '4px solid white'
                                  }}
                                />
                              ) : (
                                <img
                                  src="https://media.istockphoto.com/id/2171382633/es/vector/icono-de-perfil-de-usuario-símbolo-de-persona-anónima-gráfico-de-avatar-en-blanco.jpg?s=612x612&w=0&k=20&c=4R1fa1xdOWF2fXr6LSwe0L7O1ojy60Mcy0n624Z4qns="
                                  alt="Vista default"
                                  className="shadow-lg"
                                  style={{
                                    width: '140px',
                                    height: '140px',
                                    objectFit: 'cover',
                                    borderRadius: '20px',
                                    border: '4px solid white'
                                  }}
                                />
                              )}
                              <div className="position-absolute bottom-0 end-0 shadow-sm" style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '12px',
                                padding: '8px',
                                border: '3px solid white'
                              }}>
                                <i className="fas fa-camera text-white"></i>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="form-label fw-semibold text-dark mb-3 d-flex align-items-center">
                              <div className="d-flex align-items-center justify-content-center me-2" style={{
                                width: '24px',
                                height: '24px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '6px'
                              }}>
                                <i className="fas fa-upload text-secondary" style={{ fontSize: '12px' }}></i>
                              </div>
                              Subir nueva foto
                            </label>
                            <input
                              type="file"
                              name="photo"
                              className="form-control border-2 shadow-sm"
                              style={{
                                borderRadius: '12px',
                                backgroundColor: '#fff',
                                borderColor: '#e9ecef',
                                padding: '12px 16px'
                              }}
                              onChange={handleFileChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Información Personal - Mejorada */}
                    <div className="col-12 col-lg-8">
                      <div className="card border-0 shadow-sm h-100" style={{
                        borderRadius: '16px',
                        backgroundColor: '#fff'
                      }}>
                        <div className="card-body p-4">
                          <h6 className="fw-bold text-dark mb-4 pb-3 border-bottom d-flex align-items-center">
                            <div className="d-flex align-items-center justify-content-center me-3" style={{
                              width: '40px',
                              height: '40px',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              borderRadius: '12px'
                            }}>
                              <i className="fas fa-user-circle text-white"></i>
                            </div>
                            <span className="fs-5">Información Personal</span>
                          </h6>

                          <div className="row g-4">
                            <div className="col-12 col-md-6">
                              <label className="form-label fw-semibold text-dark mb-2 d-flex align-items-center">
                                <div className="d-flex align-items-center justify-content-center me-2" style={{
                                  width: '24px',
                                  height: '24px',
                                  backgroundColor: '#f8f9fa',
                                  borderRadius: '6px'
                                }}>
                                  <i className="fas fa-user text-secondary" style={{ fontSize: '12px' }}></i>
                                </div>
                                Nombre
                              </label>
                              <input
                                type="text"
                                className="form-control border-2 shadow-sm"
                                placeholder={data.name}
                                name="name"
                                maxLength={20}
                                value={formData.name}
                                onChange={handleInputChange}
                                style={{
                                  borderRadius: '12px',
                                  borderColor: '#e9ecef',
                                  backgroundColor: '#fff',
                                  padding: '12px 16px',
                                  fontSize: '14px',
                                  transition: 'all 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                              />
                            </div>

                            <div className="col-12 col-md-6">
                              <label className="form-label fw-semibold text-dark mb-2 d-flex align-items-center">
                                <div className="d-flex align-items-center justify-content-center me-2" style={{
                                  width: '24px',
                                  height: '24px',
                                  backgroundColor: '#f8f9fa',
                                  borderRadius: '6px'
                                }}>
                                  <i className="fas fa-user-tag text-secondary" style={{ fontSize: '12px' }}></i>
                                </div>
                                Apellidos
                              </label>
                              <input
                                type="text"
                                className="form-control border-2 shadow-sm"
                                placeholder={data.lastName}
                                name="lastName"
                                value={formData.lastName}
                                maxLength={20}
                                onChange={handleInputChange}
                                style={{
                                  borderRadius: '12px',
                                  borderColor: '#e9ecef',
                                  backgroundColor: '#fff',
                                  padding: '12px 16px',
                                  fontSize: '14px',
                                  transition: 'all 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                              />
                            </div>

                            <div className="col-12 col-md-6">
                              <label className="form-label fw-semibold text-dark mb-2 d-flex align-items-center">
                                <div className="d-flex align-items-center justify-content-center me-2" style={{
                                  width: '24px',
                                  height: '24px',
                                  backgroundColor: '#f8f9fa',
                                  borderRadius: '6px'
                                }}>
                                  <i className="fas fa-id-card text-secondary" style={{ fontSize: '12px' }}></i>
                                </div>
                                Documento
                              </label>
                              <input
                                type="text"
                                className="form-control border-2 shadow-sm"
                                placeholder={data.document}
                                name="document"
                                minLength={8}
                                maxLength={8}
                                value={formData.document}
                                onChange={handleInputChange}
                                style={{
                                  borderRadius: '12px',
                                  borderColor: '#e9ecef',
                                  backgroundColor: '#fff',
                                  padding: '12px 16px',
                                  fontSize: '14px',
                                  transition: 'all 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                              />
                            </div>

                            <div className="col-12 col-md-6">
                              <label className="form-label fw-semibold text-dark mb-2 d-flex align-items-center">
                                <div className="d-flex align-items-center justify-content-center me-2" style={{
                                  width: '24px',
                                  height: '24px',
                                  backgroundColor: '#f8f9fa',
                                  borderRadius: '6px'
                                }}>
                                  <i className="fas fa-home text-secondary" style={{ fontSize: '12px' }}></i>
                                </div>
                                Dirección
                              </label>
                              <input
                                type="text"
                                className="form-control border-2 shadow-sm"
                                placeholder={data.address}
                                name="address"
                                maxLength={40}
                                value={formData.address}
                                onChange={handleInputChange}
                                style={{
                                  borderRadius: '12px',
                                  borderColor: '#e9ecef',
                                  backgroundColor: '#fff',
                                  padding: '12px 16px',
                                  fontSize: '14px',
                                  transition: 'all 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                              />
                            </div>

                            <div className="col-12 col-md-6">
                              <label className="form-label fw-semibold text-dark mb-2 d-flex align-items-center">
                                <div className="d-flex align-items-center justify-content-center me-2" style={{
                                  width: '24px',
                                  height: '24px',
                                  backgroundColor: '#f8f9fa',
                                  borderRadius: '6px'
                                }}>
                                  <i className="fas fa-city text-secondary" style={{ fontSize: '12px' }}></i>
                                </div>
                                Ciudad
                              </label>
                              <select
                                className="form-select border-2 shadow-sm"
                                name="city"
                                value={formData.city || ""}
                                onChange={handleInputChange}
                                style={{
                                  borderRadius: '12px',
                                  borderColor: '#e9ecef',
                                  backgroundColor: '#fff',
                                  padding: '12px 16px',
                                  fontSize: '14px',
                                  transition: 'all 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                              >
                                {!data.city && <option value="" disabled>Seleccione una ciudad</option>}
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
                                  <i className="fas fa-map-marker-alt text-secondary" style={{ fontSize: '12px' }}></i>
                                </div>
                                Distrito
                              </label>
                              <select
                                className="form-select border-2 shadow-sm"
                                name="district"
                                value={formData.district || ""}
                                onChange={handleInputChange}
                                style={{
                                  borderRadius: '12px',
                                  borderColor: '#e9ecef',
                                  backgroundColor: '#fff',
                                  padding: '12px 16px',
                                  fontSize: '14px',
                                  transition: 'all 0.2s ease'
                                }}
                                disabled={!formData.city}
                                onFocus={(e) => !e.target.disabled && (e.target.style.borderColor = '#667eea')}
                                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                              >
                                <option value="">
                                  {formData.city ? "Seleccione un distrito" : "Primero seleccione una ciudad"}
                                </option>
                                {formData.city && citiesWithDistricts[formData.city] &&
                                  citiesWithDistricts[formData.city].map((district, index) => (
                                    <option key={`district-${index}`} value={district}>
                                      {district}
                                    </option>
                                  ))
                                }
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
                                  <i className="fas fa-phone text-secondary" style={{ fontSize: '12px' }}></i>
                                </div>
                                Celular
                              </label>
                              <input
                                type="text"
                                className="form-control border-2 shadow-sm"
                                placeholder={data.phone}
                                name="phone"
                                maxLength={9}
                                minLength={9}
                                value={formData.phone}
                                onChange={handleInputChange}
                                style={{
                                  borderRadius: '12px',
                                  borderColor: '#e9ecef',
                                  backgroundColor: '#fff',
                                  padding: '12px 16px',
                                  fontSize: '14px',
                                  transition: 'all 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                              />
                            </div>

                            <div className="col-12 col-md-6">
                              <label className="form-label fw-semibold text-dark mb-2">Estado del Usuario</label>
                              <div className="card border-0 shadow-sm w-100" style={{
                                borderRadius: '12px',
                                background: formData.isActive ?
                                  'linear-gradient(135deg, #d1e7dd 0%, #a3cfbb 100%)' :
                                  'linear-gradient(135deg, #f8d7da 0%, #f1b0b7 100%)'
                              }}>
                                <div className="card-body p-3">
                                  <div className="form-check d-flex align-items-center">
                                    <input
                                      type="checkbox"
                                      className="form-check-input me-3"
                                      name="isActive"
                                      checked={formData.isActive}
                                      onChange={handleInputChange}
                                      style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '6px'
                                      }}
                                    />
                                    <label className="form-check-label fw-semibold d-flex align-items-center">
                                      <div className="d-flex align-items-center justify-content-center me-2" style={{
                                        width: '28px',
                                        height: '28px',
                                        backgroundColor: formData.isActive ? '#198754' : '#dc3545',
                                        borderRadius: '50%',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                      }}>
                                        <i className={`fas ${formData.isActive ? 'fa-check' : 'fa-times'} text-white`} style={{ fontSize: '12px' }}></i>
                                      </div>
                                      <span className={formData.isActive ? 'text-success' : 'text-danger'}>
                                        {formData.isActive ? 'Usuario Activo' : 'Usuario Inactivo'}
                                      </span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botón de Guardar - Mejorado */}
                  <div className="text-center mt-5 pt-4 border-top">
                    <button
                      type="submit"
                      className="btn btn-lg px-5 py-3 fw-bold border-0 text-white shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '16px',
                        transition: 'all 0.3s ease',
                        fontSize: '16px',
                        letterSpacing: '0.5px'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                      }}
                    >
                      <i className="fas fa-save me-2"></i>
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderOverviewContent = () => {
    return (
      <div className="container-fluid px-4 py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        {/* Header Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-lg" style={{
              borderRadius: '20px',
              background: '#6394EB'
            }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="position-relative">
                    <img
                      src={formData.photo}
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
                    <h2 className="mb-1 fw-bold">¡Hola, {formData.name}! 👋</h2>
                    <p className="mb-0 opacity-75">Bienvenido de vuelta. ¿En qué podemos ayudarte hoy?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
       
        {/* Header Section----- verificar cuenta */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-lg" style={{
              background: '#7eb975',

              borderRadius: '20px'
            }}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center">
                  <div className="position-relative">
                  </div>
                  <div className="ms-4 text-white d-flex align-items-center justify-content-between w-100">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-exclamation-triangle-fill text-warning fs-1 me-3"></i>
                      <div>
                        <h2 className="mb-1 fw-bold">Atención</h2>
                        <p className="mb-1 opacity-40">
                          Tu cuenta aún no está verificada. Verifícala ahora para poder pedir servicios. ¡Es muy rápido!
                        </p>
                      </div>
                    </div>
                    <button className="btn btn-primary btn-lg me-4">Verificar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {reject.length > 0 && (
          <div className="row mb-5">
            <div className="col-12">
              <div className="card border-0 shadow-lg" style={{
                borderRadius: '20px',
                background: '#D95560'
              }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-4">
                    <div className="rounded-3 p-3 me-3" style={{ background: "#D9B155" }}>
                      <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="mb-0 text-white">Solicitudes Rechazadas</h3>
                      <p className="text-muted mb-0">Total: {reject.length} solicitudes</p>
                    </div>
                  </div>
                  <div className="row g-4">
                    {reject.map((e) => (
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
                                <p className="text-muted fw-semibold mb-1">Trabajador:</p>
                                <p className="text-dark mb-2">{e.employeeNombre}</p>

                                <p className="text-muted fw-semibold mb-1">Servicio:</p>
                                <p className="text-dark mb-0">{e.service}</p>
                              </div>

                              {/* LADO DERECHO */}
                              <div className="text-end d-flex flex-column align-items-center">
                                <span className="badge bg-success rounded-pill mb-2 px-3 py-2">
                                  <i className="fas fa-star me-1"></i> {e.employeeStar}
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
                                    src={e.employeeFoto}
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
                              <button className="btn btn-outline-danger btn-sm rounded-pill px-4"
                                onClick={() => handleDeleteReject(e._id)}>
                                Eliminar
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
                        key={index}
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
                              src={element.photoUrl}
                              alt="Foto"
                              width="100"
                              height="100"
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                          <div className="flex-grow-1 d-flex flex-column justify-content-center">
                            <p className="fw-bold mb-1">Cliente: {element.nombre}</p>
                            <p className="text-muted mb-0">Servicio en progreso con este usuario.</p>
                          </div>
                        </div>

                        <div className="card-footer bg-transparent text-center pb-3">
                          <button className="btn btn-primary btn-sm rounded-pill px-4">
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




        {/* Recommended Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-lg" style={{
              borderRadius: '20px',
              background: '#F9985D'
            }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-warning rounded-circle p-2 me-3" style={{ backgroundColor: '#439A86' }}>
                    <i className="fas fa-star text-white"></i>
                  </div>
                  <h3 className="mb-0 fw-bold text-dark">Recomendados para ti</h3>
                </div>
                <div className="row g-4">
                  {recomendados.map((trabajador) => (
                    <div key={trabajador.id} className="col-lg-4 col-md-6">
                      <div className="card h-100 border-0 shadow-sm hover-card bg-white" style={{
                        borderRadius: '15px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}>
                        <div className="card-body p-4">
                          <div className="d-flex align-items-start justify-content-between mb-3">
                            <div className="flex-grow-1">
                              <h5 className="card-title fw-bold text-dark mb-1">{trabajador.nombre}</h5>
                              <p className="card-text text-muted mb-2">{trabajador.servicio}</p>
                            </div>
                            <div className="text-end">
                              <span className="badge bg-success rounded-pill px-3 py-2">
                                <i className="fas fa-star me-1"></i>
                                {trabajador.rating}
                              </span>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <button className="btn btn-outline-primary btn-sm rounded-pill px-3">
                              Ver perfil
                            </button>
                            <button className="btn btn-link text-muted p-0">
                              <i className="fas fa-heart"></i>
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

        {/* Recent Requests Section */}
        <div className="row mb-5">
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-lg" style={{
              borderRadius: '20px',
              background: '#bbdefb'
            }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-info rounded-circle p-2 me-3">
                    <i className="fas fa-calendar-alt text-white"></i>
                  </div>
                  <h3 className="mb-0 fw-bold text-dark">Tus últimas solicitudes</h3>
                </div>
                <div className="bg-white rounded-3 shadow-sm">
                  <div className="p-0">
                    {solicitudes.map((s, index) => (
                      <div
                        key={s.id}
                        className={`d-flex justify-content-between align-items-center p-4 ${index !== solicitudes.length - 1 ? 'border-bottom' : ''}`}
                      >
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <div className="bg-light rounded-circle p-2">
                              <i className="fas fa-briefcase text-muted"></i>
                            </div>
                          </div>
                          <div>
                            <h6 className="mb-1 fw-semibold">{s.servicio}</h6>
                            <small className="text-muted">Hace 2 días</small>
                          </div>
                        </div>
                        <span className={`badge rounded-pill px-3 py-2 ${s.estado === 'Aceptado' ? 'bg-success' : 'bg-warning text-dark'
                          }`}>
                          {s.estado}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Favorites Section */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-lg" style={{
              borderRadius: '20px',
              background: 'rgb(234, 174, 174)'
            }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-danger rounded-circle p-2 me-3">
                    <i className="fas fa-heart text-white"></i>
                  </div>
                  <h3 className="mb-0 fw-bold text-dark">Tus favoritos</h3>
                </div>
                <div className="row g-3">
                  {favoritos.map((fav) => (
                    <div key={fav.id} className="col-12">
                      <div className="card border-0 shadow-sm hover-card bg-white" style={{
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}>
                        <div className="card-body p-3">
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="flex-grow-1">
                              <h6 className="card-title mb-1 fw-semibold">{fav.nombre}</h6>
                              <small className="text-muted">{fav.servicio}</small>
                            </div>
                            <button className="btn btn-link text-danger p-0">
                              <i className="fas fa-heart"></i>
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

      </div>

    );
  };

  // Nota: Los estilos CSS deben agregarse por separado en tu archivo de estilos
  // Clases CSS necesarias: hover-card, y los estilos inline ya están incluidos en el JSX

  const renderContent = () => {
    switch (activeSection) {
      case 'tables':
        return renderTableContent();
      case 'settings':
        return renderFormCustomer();
      case 'overview':
        return renderOverviewContent();
      case 'customers':
        return renderApiTable();
      default:
        return renderOverviewContent();
    }
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


      <div className="min-h-screen bg-light">
        {/* Sidebar Izquierdo (Desktop) */}
        <div className="position-fixed top-0 start-0 h-100 shadow-lg d-none d-lg-block sidebar-desktop" style={{ zIndex: 1000 }}>
          <div className="p-4">
            <div className="d-flex align-items-center">
              <div>
                <h6 className="mb-0" style={{ fontSize: "40px", fontWeight: "bold", marginTop: "15px", color: "#3a88fe" }}>ServiGO</h6>
                <small className="text-muted">customer</small>
              </div>
            </div>
          </div>

          <nav className="p-3">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={`item-${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  style={{ color: "black", backgroundColor: "#f2f3f4" }}
                  className={`btn w-100 text-start mb-2 d-flex align-items-center ${activeSection === item.id ? 'btn-outline-light' : 'btn-outline-light'
                    }`}
                >
                  <Icon size={36} color="#3a88fe" strokeWidth={1} className="me-3" />
                  {item.label}
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
                      <span className="d-none d-md-inline">{data ? data.name : ""}</span>
                      <div className="p-1">
                        <div className="position-relative">
                          <img
                            src={formData.photo}
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
                              <div className="fw-medium small">{data ? data.name : ""}</div>
                              <small className="text-muted" style={{ fontSize: "13px" }}>{data ? data.email : ""}</small>
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
              <div className="card border-0 shadow-sm">
                <div className="card-body p-3">
                  <h6 className="card-title mb-2 d-flex align-items-center">
                    <BarChart3 size={18} className="me-2 text-primary" />
                    Estadísticas
                  </h6>
                  <div className="row text-center">
                    <div className="col-6">
                      <div className="border-end">
                        <h5 className="mb-0 text-primary">127</h5>
                        <small className="text-muted">Servicios</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <h5 className="mb-0 text-success">42</h5>
                      <small className="text-muted">Completados</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notificaciones */}
            <div className="mb-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-3">
                  <h6 className="card-title mb-2 d-flex align-items-center">
                    <Bell size={18} className="me-2 text-warning" />
                    Notificaciones
                  </h6>
                  <div className="small">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Nuevas solicitudes</span>
                      <span className="badge bg-primary rounded-pill">3</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Mensajes pendientes</span>
                      <span className="badge bg-warning rounded-pill">2</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Actualizaciones</span>
                      <span className="badge bg-info rounded-pill">1</span>
                    </div>
                  </div>
                </div>
              </div>
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
                      <div className="fw-medium">Servicio completado</div>
                      <div className="text-muted">Hace 2 horas</div>
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

            {/* Accesos Rápidos */}
            <div className="mb-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-3">
                  <h6 className="card-title mb-2 d-flex align-items-center">
                    <Zap size={18} className="me-2 text-success" />
                    Accesos Rápidos
                  </h6>
                  <div className="d-grid gap-2">
                    <button className="btn btn-outline-primary btn-sm">
                      <Plus size={14} className="me-1" />
                      Nuevo Servicio
                    </button>
                    <button className="btn btn-outline-success btn-sm">
                      <MessageCircle size={14} className="me-1" />
                      Mensajes
                    </button>
                    <button className="btn btn-outline-info btn-sm">
                      <Calendar size={14} className="me-1" />
                      Calendario
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Ayuda */}
            <div className="mb-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-3">
                  <h6 className="card-title mb-2 d-flex align-items-center">
                    <HelpCircle size={18} className="me-2 text-secondary" />
                    Centro de Ayuda
                  </h6>
                  <p className="card-text small text-muted mb-2">¿Necesitas ayuda? Consulta nuestras guías</p>
                  <button className="btn btn-outline-secondary btn-sm">
                    Ver Tutoriales
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile Sidebar Overlay - CORREGIDO */}
        <div
          className={`position-fixed top-0 start-0 w-100 h-100 d-lg-none ${sidebarOpen ? '' : 'd-none'}`}
          style={{
            zIndex: 1050,
            backgroundColor: sidebarOpen ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
            transition: 'background-color 0.3s ease',
            pointerEvents: sidebarOpen ? 'auto' : 'none'
          }}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Mobile Sidebar */}
        <div
          className="position-fixed top-0 start-0 h-100 bg-dark text-white shadow-lg d-lg-none"
          style={{
            width: '250px',
            zIndex: 1051,
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease-in-out'
          }}
        >
          <div className="p-4 border-bottom border-secondary">
            <div className="d-flex align-items-center">
              <div className="bg-primary rounded-circle p-2 me-3">
                <User size={20} />
              </div>
              <div>
                <small className="text-muted">Panel de Control</small>
              </div>
            </div>
          </div>
          <nav className="p-3">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={`stat-${item.id}`}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`btn w-100 text-start mb-2 d-flex align-items-center ${activeSection === item.id ? 'btn-outline-light' : 'btn-outline-light'
                    }`}
                >
                  <Icon size={18} strokeWidth={0} className="me-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>


        {/* Main Content - AHORA CENTRADO */}
        <div className="main-content">
          {/* Header */}
          <header
            className="bg-white shadow-sm py-4 mt-3"
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 1000,
              borderBottom: '1px solid #ddd'
            }}
          >
            <div className="container">
              <div className="d-flex justify-content-between align-items-center">

                {/* Botón hamburguesa/X */}
                <button
                  className="btn d-lg-none position-relative"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: '8px',
                    width: '40px',
                    height: '40px'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {sidebarOpen ? (
                      <X
                        size={24}
                        className="text-primary"
                        style={{
                          transform: 'rotate(0deg)',
                          transition: 'transform 0.3s ease',
                          zIndex: 1052,
                        }}
                      />
                    ) : (
                      <Menu
                        size={24}
                        className="text-primary"
                        style={{
                          transform: 'rotate(0deg)',
                          transition: 'transform 0.3s ease'
                        }}
                      />
                    )}
                  </div>
                </button>

                {/* Navegación principal - Desktop */}
                <div className="d-none d-lg-flex justify-content-center flex-grow-1">
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ width: '600px' }}
                  >
                    <Home size={35} strokeWidth={2} className="text-primary" style={{ cursor: 'pointer' }} />
                    <Users size={35} strokeWidth={2} className="text-primary" style={{ cursor: 'pointer' }} />
                    <Store size={35} strokeWidth={2} className="text-primary" style={{ cursor: 'pointer' }} />
                    <Search size={35} strokeWidth={2} className="text-primary" style={{ cursor: 'pointer' }} />
                    <Bell size={35} strokeWidth={2} className="text-primary" style={{ cursor: 'pointer' }} />
                    <MessageCircleMore size={35} strokeWidth={2} className="text-primary" style={{ cursor: 'pointer' }} />
                  </div>
                </div>

                {/* Logo en móvil */}
                <div className="d-lg-none">
                  <span className="fw-bold text-primary">Mi App</span>
                </div>

                {/* Espacio para balance en desktop */}
                <div className="d-none d-lg-block" style={{ width: '40px' }}></div>

              </div>
            </div>
          </header>
          {/* Content Area - CENTRADO ENTRE LOS DOS SIDEBARS */}
          {renderContent()}
          {/* ChatBox */}
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
                setChatsActivos(prev => prev.filter(c => c.roomId !== chat.roomId));
              }}
              style={{ right: 20 + index * 340 }} // Ajusta para que los popups no se sobrepongan
            />
          ))}

        </div>
      </div>
    </>
  );
}
export default CustomerDashboard;