import { useNavigate, useParams } from 'react-router-dom';
import { Mail, Phone, MapPin, CalendarDays, Home, Globe, Info, Search, BriefcaseBusiness, Filter, ArrowLeft, Star } from 'lucide-react';
import '../App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ServiceRequestModal from './ServiceRequestModal';
import '../App.css';

export default function InformationEmployee() {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [message, setMessage] = useState('');
  const { employeeId } = useParams();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [servicioSeleccionado, setServicioSeleccionado] = useState('');
  const worker = {
    photo: 'https://randomuser.me/api/portraits/men/75.jpg',
    firstName: 'Juan',
    lastName: 'Pérez López',
    email: 'juan.perez@email.com',
    phone: '+51 987 654 321',
    address: 'Av. Siempre Viva 123',
    district: 'Miraflores',
    city: 'Lima',
    serviceHistory: [
      { name: 'Servicio de limpieza', date: '10/05/2025', description: 'Limpieza profunda de la casa, bien respetoso, los recomiendo' },
      { name: 'Reparación eléctrica', date: '22/04/2025', description: 'Reemplazo de bombillas y revisión de cableado sabe hacer su chamba' },
      { name: 'Pintura de paredes', date: '30/03/2025', description: 'Pintura de la sala y el comedor, y te da sugerencia, se nota que sabe lo que hace' },
      { name: 'Mantenimiento de aire acondicionado', date: '15/03/2025', description: 'Limpieza y revisión del sistema de aire acondicionado' },
      { name: 'Instalación de internet', date: '05/02/2025', description: 'Instalación de router y configuración de red' },
    ],
  };
  const [activeTab, setActiveTab] = useState('Publicaciones');
  const [posts, setPosts] = useState([
    {
      id: 1,
      content: "¡Qué día tan hermoso! Disfrutando del sol en el parque con amigos. La vida es bella cuando compartes momentos especiales con las personas que amas. 🌞❤️",
      time: "hace 2 horas",
      privacy: "🌍",
      likes: 127,
      comments: 23,
      shares: 5,
      isLiked: true,
      hasImage: true
    },
    {
      id: 2,
      content: "Recordando este increíble viaje. Cada lugar tiene su magia y cada experiencia nos hace crecer. ¿Cuál ha sido vuestro destino favorito? ✈️🗺️",
      time: "hace 1 día",
      privacy: "👥",
      likes: 89,
      comments: 15,
      shares: 2,
      isLiked: false,
      hasImage: false
    },
    {
      id: 3,
      content: "Nuevo proyecto terminado! Ha sido un desafío increíble pero muy gratificante. Gracias a todo el equipo por su dedicación y esfuerzo. 🚀💪",
      time: "hace 3 días",
      privacy: "🌍",
      likes: 156,
      comments: 31,
      shares: 8,
      isLiked: false,
      hasImage: false
    }
  ]);

  const tabs = ['Publicaciones', 'Información', 'Amigos', 'Fotos', 'Videos', 'Check-ins', 'Más'];

  const handleLike = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
          : post
      )
    );
  };

  const handleComposerClick = () => {
    alert('Funcionalidad de compositor - Aquí se abriría el modal para crear publicaciones');
  };

  useEffect(() => {
    const getEmployeeData = async () => {
      try {
        const response = await axios(`http://localhost:4500/employee/${employeeId}`);
        if (response.status === 200) {
          setData(response.data);
          setLoading(false);
        } else {
          console.error('Error al obtener los datos del empleado:');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error al conectar a la API:', error);
      }
    }
    getEmployeeData();
  }, [employeeId]);

  // Maneja la solicitud de servicio al hacer clic en el botón "Pedir Servicio"
  const handlePedirServicio = ({ servicio }) => {
    setServicioSeleccionado(servicio);
    setModalOpen(true);
  };

  // buscar servicios especificos
  const filteredEntries = data?.services
    ? Object.entries(data.services).filter(
      ([servicio, descripcion]) =>
        servicio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const infoItems = [
    {
      icon: <MapPin size={20} />,
      text: `Vive en ${data.city}, ${data.district}`
    },
    {
      icon: <CalendarDays size={20} />,
      text: `Se unió el ${data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'fecha desconocida'}`
    },
    {
      icon: <Mail size={20} />,
      text: data.email
    },
    {
      icon: <Home size={20} />,
      text: data.address
    },
    {
      icon: <Phone size={20} />,
      text: data.phone
    },
    {
      icon: <Globe size={20} />,
      text: `${Array.isArray(data.coverage)
        ? `${data.coverage.map((item) => item).join(', ')}`
        : 'Sin datos'}`
    }
  ];
  // Mostrar un spinner mientras se cargan los datos
  if (loading) {
    return (
      <div className="container-spinner">
        <div className="spinner"></div>
        <p>cargando...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>

      {/* Main Container */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        {/* Cover Photo */}
        <div style={{
          height: '200px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <button style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            border: 'none',
            fontSize: '14px'
          }}>
            📷 Editar foto de portada
          </button>
        </div>

        {/* Profile Section */}
        <div style={{ padding: '16px 24px', position: 'relative' }}>
          {data.photo ? (
            <div style={{
              width: '170px',
              height: '170px',
              borderRadius: '50%',
              border: '4px solid white',
              position: 'absolute',
              top: '-85px',
              left: '24px',
              background: '#f0f2f5',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '60px',
              color: '#65676b'
            }}>
              <img src={data.photo} width="150px" />
            </div>
          ) : (
            <div style={{
              width: '170px',
              height: '170px',
              borderRadius: '50%',
              border: '4px solid white',
              position: 'absolute',
              top: '-85px',
              left: '24px',
              background: '#f0f2f5',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '60px',
              color: '#65676b'
            }}>
              👤
            </div>
          )}

          <div style={{ marginLeft: '200px', paddingTop: '20px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px', color: '#1c1e21' }}>
              {data.name} {data.lastName}
            </h1>
            <p style={{ color: '#65676b', marginBottom: '16px' }}>
              1,234 amigos · 89 amigos en común
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn btn-primary me-2" onClick={() => navigate(-1)}>
                <ArrowLeft size={18} className="me-1" /> Atras
              </button>
              <button style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                background: '#1877f2',
                color: 'white',
                transition: 'background 0.2s'
              }}>
                ➕ Agregar a amigos
              </button>
              <button style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                background: '#e4e6ea',
                color: '#1c1e21',
                transition: 'background 0.2s'
              }}>
                ⋯
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          borderTop: '1px solid #dadde1',
          padding: '0 24px',
          display: 'flex',
          overflowX: 'auto'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '16px 20px',
                color: activeTab === tab ? '#1877f2' : '#65676b',
                textDecoration: 'none',
                fontWeight: '600',
                borderBottom: activeTab === tab ? '3px solid #1877f2' : '3px solid transparent',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.target.style.background = '#f0f2f5';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.target.style.background = 'none';
                }
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div style={{
        display: 'flex',
        gap: '20px',
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        flexWrap: 'wrap'
      }}>
        {/* Sidebar */}
        <div style={{ width: '100%', flexShrink: 0 }}>
          {/* Información */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#1c1e21'
            }}>
              Información
            </h3>

            {infoItems.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px',
                color: '#65676b'
              }}>
                <div style={{ marginRight: '12px', display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                </div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Servicios ofrecidos */}
          <div className="container-fluid">
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1c1e21' }}>
              Servicios
            </h3>

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
                            placeholder="Buscar servicio..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                          />
                          <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenedor con scroll solo para los servicios */}
            <div
              style={{
                height: '400px', // o el alto que tú desees
                overflowY: 'auto',
                paddingRight: '10px' // para que no se corte con la scrollbar
              }}
            >
              {filteredEntries.length === 0 ? (
                <p className="text-center text-muted">No se encontraron servicios.</p>
              ) : (
                filteredEntries.map(([servicio, descripcion]) => (
                  <div
                    key={servicio}
                    className="card mb-3 shadow border border-3 border-bg-primary-subtle rounded-4 bg-opacity-15"
                    style={{
                      maxWidth: '700px',
                      margin: '0 auto',
                      minHeight: '150px'
                    }}
                  >
                    <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center">
                      <div className="text-center text-md-start">
                        <div className='d-flex mb-2'>
                          <BriefcaseBusiness size={23} className='mr-2' />
                          <h5 className="card-title text-capitalize mb-2">{servicio}</h5>
                        </div>
                        <div className='d-flex'>
                          <Info size={18} className='mr-2' />
                          <p className="card-text text-muted mb-0">{descripcion}</p>
                        </div>
                      </div>
                      <div className="mt-3 mt-md-0 pr-4">
                        <button
                          className="btn btn-primary"
                          onClick={() => handlePedirServicio({ servicio })}
                        >
                          Solicitar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>



          {/* Modal para solicitar servicio */}
          <ServiceRequestModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            employeeId={employeeId}
            customerId={id}
            service={servicioSeleccionado}
          />


          {/* Historial */}
          <div className="pt-3">
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1c1e21', marginLeft: "1rem" }}>
              Historial de Servicios
            </h3>
            <div className="row justify-content-center">
              {worker.serviceHistory.length === 0 ? (
                <p className="text-muted text-center">No hay servicios registrados.</p>
              ) : (
                worker.serviceHistory.map((service, idx) => (
                  <div key={idx} className="col-12 col-md-6 col-lg-5 mb-3">
                    <div className="card border shadow-sm h-100 rounded-4">
                      <div className="card-body d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="card-title fw-semibold mb-1">{service.name}</h6>
                          <p className="card-text text-muted mb-0">Fecha: {service.date}</p>
                          <h6 className="card-title fw-semibold mb-1 pt-3">Cristina Rosales</h6>
                          <p className="card-text text-muted mb-0">{service.description}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          7
                          <Star className="text-warning" fill="#ffc107" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Fotos */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1c1e21' }}>
              Fotos
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '4px'
            }}>
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} style={{
                  aspectRatio: '1',
                  background: '#f0f2f5',
                  borderRadius: '4px'
                }}></div>
              ))}
            </div>
          </div>

          {/* Amigos */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#1c1e21' }}>
              Amigos
            </h3>
            <p style={{ color: '#65676b', marginBottom: '12px' }}>1,234 amigos</p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '4px'
            }}>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{
                  aspectRatio: '1',
                  background: '#f0f2f5',
                  borderRadius: '4px'
                }}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: '500px' }}>
          {/* Post Composer */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#f0f2f5',
                marginRight: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: '#65676b'
              }}>
                👤
              </div>
              <input
                type="text"
                placeholder="¿Qué estás pensando, María?"
                onClick={handleComposerClick}
                style={{
                  flex: 1,
                  background: '#f0f2f5',
                  border: 'none',
                  padding: '12px 16px',
                  borderRadius: '24px',
                  color: '#65676b',
                  cursor: 'pointer',
                  outline: 'none'
                }}
                readOnly
              />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              borderTop: '1px solid #dadde1',
              paddingTop: '12px'
            }}>
              {[
                { icon: '🔴', text: 'Video en vivo' },
                { icon: '🟢', text: 'Foto/video' },
                { icon: '🟡', text: 'Sentimiento/actividad' }
              ].map((action, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                  onMouseEnter={(e) => e.target.style.background = '#f0f2f5'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <span style={{ marginRight: '8px' }}>{action.icon}</span>
                  <span style={{ color: '#65676b' }}>{action.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Posts */}
          {posts.map((post) => (
            <div key={post.id} style={{
              background: 'white',
              borderRadius: '8px',
              marginBottom: '16px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              {/* Post Header */}
              <div style={{
                padding: '16px 16px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#f0f2f5',
                    marginRight: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    color: '#65676b'
                  }}>
                    👤
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px', color: '#1c1e21' }}>
                      María González
                    </h4>
                    <span style={{ fontSize: '12px', color: '#65676b' }}>
                      {post.time} · {post.privacy}
                    </span>
                  </div>
                </div>
                <div style={{ color: '#65676b', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}>⋯</div>
              </div>

              {/* Post Content */}
              <div style={{ padding: '12px 16px' }}>
                <p style={{ marginBottom: '12px', lineHeight: '1.4', color: '#1c1e21' }}>
                  {post.content}
                </p>
                {post.hasImage && (
                  <div style={{
                    width: '100%',
                    height: '300px',
                    background: '#f0f2f5',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#65676b',
                    fontSize: '18px'
                  }}>
                    📷 Imagen de la publicación
                  </div>
                )}
              </div>

              {/* Post Stats */}
              <div style={{
                padding: '12px 16px',
                borderTop: '1px solid #dadde1',
                borderBottom: '1px solid #dadde1',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '14px',
                color: '#65676b'
              }}>
                <span>👍❤️😊 {post.isLiked ? 'Tú y ' : ''}{post.likes} {post.isLiked ? 'personas más' : 'reacciones'}</span>
                <span>{post.comments} comentarios · {post.shares} veces compartido</span>
              </div>

              {/* Post Actions */}
              <div style={{ padding: '8px', display: 'flex' }}>
                {[
                  {
                    text: post.isLiked ? 'Te gusta' : 'Me gusta',
                    icon: '👍',
                    action: () => handleLike(post.id),
                    active: post.isLiked
                  },
                  { text: 'Comentar', icon: '💬', action: () => { }, active: false },
                  { text: 'Compartir', icon: '↗️', action: () => { }, active: false }
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    style={{
                      flex: 1,
                      padding: '8px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      transition: 'background 0.2s',
                      fontWeight: '600',
                      color: action.active ? '#1877f2' : '#65676b',
                      background: 'none',
                      border: 'none',
                      fontSize: '14px'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#f0f2f5'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    {action.icon} {action.text}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>




      <div className="container my-5">
        <div className="card">
          {/* Parte superior: foto + info */}
          <div className="row align-items-center border pb-5 border-opacity-25 border-1 border-secondary-subtle rounded-4 justify-content-center g-4 mb-4">
            <div className="col-md-3 text-center">
              <img
                src={data.photo}
                alt={`Foto de ${data.firstName} ${data.lastName}`}
                className="img-fluid rounded-circle border border-3 border-black shadow"
                style={{ width: '160px', height: '160px', objectFit: 'cover' }}
              />
            </div>

            <div className="col-md-7 text-center text-md-start">
              <h3 className="fw-bold text-primary">{data.name} {data.lastName}</h3>
              <p><Mail size={18} className="me-2 text-secondary" /><strong>Email:</strong> {data.email}</p>
              <p><Phone size={18} className="me-2 text-secondary" /><strong>Celular:</strong> {data.phone}</p>
              <p>
                <MapPin size={18} className="me-2 text-secondary" />
                <strong>Dirección:</strong> {data.address}, {data.district}, {data.city}
              </p>
              <div className="mt-3">
                <button className="btn btn-primary me-2" onClick={() => navigate(-1)}>
                  <ArrowLeft size={18} className="me-1" /> Retroceder
                </button>
              </div>
            </div>
          </div>

          {/* Servicios ofrecidos */}
          <div className="container-fluid py-5">
            <h2 className="text-center text-dark mb-4">Mis Servicios</h2>

            {Object.entries(data.services).map(([servicio, descripcion]) => (
              <div
                key={servicio}
                className="card mb-4 shadow border border-3 border-bg-primary-subtle rounded-4 bg-opacity-15"
                style={{ maxWidth: '700px', margin: '0 auto', minHeight: '150px' }}
              >
                <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center">
                  <div className="text-center text-md-start">
                    <h5 className="card-title text-capitalize mb-2">{servicio}</h5>
                    <p className="card-text text-muted mb-0">{descripcion}</p>
                  </div>

                  <div className="mt-3 mt-md-0">
                    <button
                      className="btn btn-primary"
                      onClick={() => handlePedirServicio({ servicio })}
                    >
                      Pedir Servicio
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>



          {/* Modal para solicitar servicio */}
          <ServiceRequestModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            employeeId={employeeId}
            customerId={id}
            service={servicioSeleccionado}
          />

          <hr style={{ borderTop: '3px solid #dee2e6' }} />

          {/* Historial */}
          <div className="pt-3">
            <h5 className="text-center text-secondary mb-4">Historial de Servicios Realizados</h5>
            <div className="row justify-content-center">
              {worker.serviceHistory.length === 0 ? (
                <p className="text-muted text-center">No hay servicios registrados.</p>
              ) : (
                worker.serviceHistory.map((service, idx) => (
                  <div key={idx} className="col-12 col-md-6 col-lg-5 mb-3">
                    <div className="card border shadow-sm h-100 rounded-4">
                      <div className="card-body d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="card-title fw-semibold mb-1">{service.name}</h6>
                          <p className="card-text text-muted mb-0">Fecha: {service.date}</p>
                          <h6 className="card-title fw-semibold mb-1 pt-3">Cristina Rosales</h6>
                          <p className="card-text text-muted mb-0">{service.description}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          7
                          <Star className="text-warning" fill="#ffc107" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
