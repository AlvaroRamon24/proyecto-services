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
  CreditCard, 
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Activity,
  Calendar,
  Mail,
  Phone,
  LogOut,
  UserCircle,
  Table,
  Edit,
  Trash2,
  Eye,
  Plus,
  Filter
} from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [data, setData] = useState({});
  const { id } = useParams();

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

  // Usuarios ficticios para la tabla
  const ficticiousUsers = [
    {
      id: 1,
      nombre: 'Ana García',
      email: 'ana.garcia@email.com',
      telefono: '+34 612 345 678',
      ciudad: 'Madrid',
      fechaRegistro: '2024-01-15',
      estado: 'Activo',
      ultimoAcceso: '2024-05-20'
    },
    {
      id: 2,
      nombre: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      telefono: '+34 698 765 432',
      ciudad: 'Barcelona',
      fechaRegistro: '2024-02-03',
      estado: 'Activo',
      ultimoAcceso: '2024-05-22'
    },
    {
      id: 3,
      nombre: 'María López',
      email: 'maria.lopez@email.com',
      telefono: '+34 645 123 789',
      ciudad: 'Valencia',
      fechaRegistro: '2024-01-28',
      estado: 'Inactivo',
      ultimoAcceso: '2024-05-10'
    },
    {
      id: 4,
      nombre: 'David Martín',
      email: 'david.martin@email.com',
      telefono: '+34 687 456 123',
      ciudad: 'Sevilla',
      fechaRegistro: '2024-03-12',
      estado: 'Activo',
      ultimoAcceso: '2024-05-23'
    },
    {
      id: 5,
      nombre: 'Laura Fernández',
      email: 'laura.fernandez@email.com',
      telefono: '+34 623 789 456',
      ciudad: 'Bilbao',
      fechaRegistro: '2024-02-18',
      estado: 'Activo',
      ultimoAcceso: '2024-05-21'
    },
    {
      id: 6,
      nombre: 'Javier Sánchez',
      email: 'javier.sanchez@email.com',
      telefono: '+34 654 321 987',
      ciudad: 'Málaga',
      fechaRegistro: '2024-04-05',
      estado: 'Pendiente',
      ultimoAcceso: '2024-05-19'
    },
    {
      id: 7,
      nombre: 'Carmen Ruiz',
      email: 'carmen.ruiz@email.com',
      telefono: '+34 678 912 345',
      ciudad: 'Zaragoza',
      fechaRegistro: '2024-01-22',
      estado: 'Activo',
      ultimoAcceso: '2024-05-23'
    },
    {
      id: 8,
      nombre: 'Roberto Torres',
      email: 'roberto.torres@email.com',
      telefono: '+34 632 147 258',
      ciudad: 'Vigo',
      fechaRegistro: '2024-03-08',
      estado: 'Inactivo',
      ultimoAcceso: '2024-05-15'
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

  const menuItems = [
    { id: 'overview', label: 'Panel Principal', icon: Home },
    { id: 'analytics', label: 'Analíticas', icon: BarChart3 },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'tables', label: 'Tablas', icon: Table },
    { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
    { id: 'payments', label: 'Pagos', icon: CreditCard },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

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
  useEffect(() => {
    const apiConnectCustomer = async () => {
      try {
        const response = await axios(`http://localhost:4500/customer/${id}`);
        if (response.status === 200) {
          setData(response.data);
        }
      }catch (error) {
        console.error('Error al conectar a la API:', error);
      }
    }
    apiConnectCustomer();
  },[id]);

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

        {/* Tabla de usuarios */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 d-flex align-items-center">
                    <Table size={18} className="me-2 text-primary" />
                    Lista de Usuarios ({ficticiousUsers.length})
                  </h6>
                  <div className="d-flex align-items-center">
                    <small className="text-muted me-3">Mostrando {ficticiousUsers.length} de {ficticiousUsers.length} usuarios</small>
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
                        <th className="border-0 py-3">Fecha Registro</th>
                        <th className="border-0 py-3">Estado</th>
                        <th className="border-0 py-3">Último Acceso</th>
                        <th className="border-0 py-3 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ficticiousUsers.map(user => (
                        <tr key={user.id}>
                          <td className="py-3">
                            <span className="badge bg-light text-dark">{user.id}</span>
                          </td>
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                <User size={16} className="text-primary" />
                              </div>
                              <div>
                                <div className="fw-medium">{user.nombre}</div>
                                <small className="text-muted">{user.email}</small>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="d-flex align-items-center text-muted small">
                              <Phone size={14} className="me-1" />
                              {user.telefono}
                            </div>
                            <div className="d-flex align-items-center text-muted small mt-1">
                              <Mail size={14} className="me-1" />
                              {user.email}
                            </div>
                          </td>
                          <td className="py-3">{user.ciudad}</td>
                          <td className="py-3">
                            <small className="text-muted">{user.fechaRegistro}</small>
                          </td>
                          <td className="py-3">
                            <span className={`badge ${
                              user.estado === 'Activo' ? 'bg-success' :
                              user.estado === 'Inactivo' ? 'bg-danger' :
                              'bg-warning'
                            }`}>
                              {user.estado}
                            </span>
                          </td>
                          <td className="py-3">
                            <small className="text-muted">{user.ultimoAcceso}</small>
                          </td>
                          <td className="py-3 text-center">
                            <div className="btn-group" role="group">
                              <button className="btn btn-sm btn-outline-primary" title="Ver detalles">
                                <Eye size={14} />
                              </button>
                              <button className="btn btn-sm btn-outline-secondary" title="Editar">
                                <Edit size={14} />
                              </button>
                              <button className="btn btn-sm btn-outline-danger" title="Eliminar">
                                <Trash2 size={14} />
                              </button>
                            </div>
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

  const renderFormCustomer = () => {
    return(
      <form>
        <input type="text" className="form-control mb-3" placeholder="Nombre" />
        <input type="email" className="form-control mb-3" placeholder="Email" />
        <input type="text" className="form-control mb-3" placeholder="Teléfono" />
        <input type="text" className="form-control mb-3" placeholder="Ciudad" />
        <input type="text" className="form-control mb-3" placeholder="Dirección" />
        <input type="text" className="form-control mb-3" placeholder="Código Postal" />
        <input type="text" className="form-control mb-3" placeholder="Estado" />
        <input type="text" className="form-control mb-3" placeholder="Fecha de Registro" />
        <input type="text" className="form-control mb-3" placeholder="Último Acceso" />
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-secondary me-2">Cancelar</button>
          <button type="submit" className="btn btn-primary">Guardar Cambios</button>
        </div>
      </form>
    )
  }
  const renderOverviewContent = () => {
    return (
      <>
        {/* Stats Cards */}
        <div className="container-fluid px-4">
          <div className="row mb-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="text-muted small mb-1">{stat.title}</div>
                          <div className="h4 mb-0">{stat.value}</div>
                          <div className={`small ${stat.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                            {stat.change} desde el mes pasado
                          </div>
                        </div>
                        <div className={`bg-${stat.color} bg-opacity-10 rounded-circle p-3`}>
                          <Icon className={`text-${stat.color}`} size={24} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts and Activity */}
          <div className="row">
            {/* Chart Area */}
            <div className="col-xl-8 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3">
                  <h6 className="mb-0 d-flex align-items-center">
                    <BarChart3 size={18} className="me-2 text-primary" />
                    Resumen de Ventas
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-4 mb-3">
                      <div className="border-end border-2">
                        <div className="h5 text-primary mb-1">$12,426</div>
                        <div className="text-muted small">Esta Semana</div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="border-end border-2">
                        <div className="h5 text-success mb-1">$48,094</div>
                        <div className="text-muted small">Este Mes</div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="h5 text-info mb-1">$189,245</div>
                      <div className="text-muted small">Este Año</div>
                    </div>
                  </div>
                  
                  {/* Simulación de gráfico */}
                  <div className="bg-light rounded p-4 text-center" style={{height: '200px'}}>
                    <Activity size={48} className="text-muted mb-3" />
                    <p className="text-muted">Gráfico de ventas interactivo</p>
                    <small className="text-muted">Los datos se actualizan en tiempo real</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="col-xl-4 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3">
                  <h6 className="mb-0 d-flex align-items-center">
                    <Activity size={18} className="me-2 text-primary" />
                    Actividad Reciente
                  </h6>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {recentActivity.map(activity => (
                      <div key={activity.id} className="list-group-item border-0 py-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                            <div className="bg-primary rounded-circle" style={{width: '8px', height: '8px'}}></div>
                          </div>
                          <div className="flex-grow-1">
                            <div className="fw-medium mb-1">{activity.action}</div>
                            <small className="text-muted">{activity.time}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3">
                  <h6 className="mb-0">Acciones Rápidas</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3 col-sm-6 mb-3">
                      <button className="btn btn-outline-primary w-100 py-3">
                        <Users size={24} className="mb-2 d-block mx-auto" />
                        Agregar Cliente
                      </button>
                    </div>
                    <div className="col-md-3 col-sm-6 mb-3">
                      <button className="btn btn-outline-success w-100 py-3">
                        <ShoppingBag size={24} className="mb-2 d-block mx-auto" />
                        Nuevo Pedido
                      </button>
                    </div>
                    <div className="col-md-3 col-sm-6 mb-3">
                      <button className="btn btn-outline-info w-100 py-3">
                        <BarChart3 size={24} className="mb-2 d-block mx-auto" />
                        Ver Reportes
                      </button>
                    </div>
                    <div className="col-md-3 col-sm-6 mb-3">
                      <button className="btn btn-outline-warning w-100 py-3">
                        <Settings size={24} className="mb-2 d-block mx-auto" />
                        Configurar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'tables':
        return renderTableContent();
      case 'settings':
        return renderFormCustomer();
      case 'overview':
        return renderOverviewContent();
      default:
        return renderOverviewContent();
    }
  };

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
        .main-content {
          margin-left: 250px;
        }
        @media (max-width: 991.98px) {
          .main-content {
            margin-left: 0;
          }
        }
        .table-hover tbody tr:hover {
          background-color: #f8f9fa;
        }
      `}</style>
      
      <div className="min-h-screen bg-light">
        {/* Sidebar Desktop */}
        <div className="position-fixed top-0 start-0 h-100 bg-dark text-white shadow-lg d-none d-lg-block sidebar-desktop" style={{zIndex: 1000}}>
          <div className="p-4 border-bottom border-secondary">
            <div className="d-flex align-items-center">
              <div className="bg-primary rounded-circle p-2 me-3">
                <User size={20} />
              </div>
              <div>
                <h6 className="mb-0">Mi Dashboard</h6>
                <small className="text-muted">Panel de Control</small>
              </div>
            </div>
          </div>
          
          <nav className="p-3">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`btn w-100 text-start mb-2 d-flex align-items-center ${
                    activeSection === item.id ? 'btn-primary' : 'btn-outline-light'
                  }`}
                >
                  <Icon size={18} className="me-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none" 
            style={{zIndex: 999}}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div className={`position-fixed top-0 start-0 h-100 bg-dark text-white shadow-lg d-lg-none ${sidebarOpen ? '' : 'd-none'}`} style={{width: '250px', zIndex: 1000}}>
          <div className="p-4 border-bottom border-secondary">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <div className="bg-primary rounded-circle p-2 me-3">
                  <User size={20} />
                </div>
                <div>
                  <h6 className="mb-0">Mi Dashboard</h6>
                  <small className="text-muted">Panel de Control</small>
                </div>
              </div>
              <button 
                className="btn btn-sm btn-outline-light"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          <nav className="p-3">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`btn w-100 text-start mb-2 d-flex align-items-center ${
                    activeSection === item.id ? 'btn-primary' : 'btn-outline-light'
                  }`}
                >
                  <Icon size={18} className="me-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Header */}
          <header className="bg-white shadow-sm p-3 mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <button 
                  className="btn btn-outline-secondary d-lg-none me-3"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <Menu size={20} />
                </button>
                <h4 className="mb-0 text-dark d-none d-md-block">
                  {activeSection === 'tables' ? 'Gestión de Tablas' : 'Panel de Control'}
                </h4>
                <h5 className="mb-0 text-dark d-md-none">
                  {activeSection === 'tables' ? 'Tablas' : 'Dashboard'}
                </h5>
              </div>
              
              <div className="d-flex align-items-center">
                <div className="position-relative me-3 d-none d-md-block">
                  <input 
                    type="text" 
                    className="form-control ps-5" 
                    placeholder="Buscar..." 
                    style={{width: '300px'}}
                  />
                  <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
                </div>
                
                {/* Notificaciones Dropdown */}
                <div className="position-relative me-2 dropdown-container">
                  <button 
                    className="btn btn-outline-secondary position-relative"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell size={18} />
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.6em'}}>
                      3
                    </span>
                  </button>
                  
                  {showNotifications && (
                    <div className="position-absolute top-100 end-0 mt-2 bg-white border rounded shadow-lg" style={{width: '350px', zIndex: 1050}}>
                      <div className="p-3 border-bottom bg-light">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">Notificaciones</h6>
                          <button 
                            className="btn-close"
                            onClick={() => setShowNotifications(false)}
                          ></button>
                        </div>
                      </div>
                      <div className="p-0" style={{maxHeight: '400px', overflowY: 'auto'}}>
                        {notifications.map(notification => (
                          <div key={notification.id} className={`p-3 border-bottom ${notification.unread ? 'bg-light' : ''}`}>
                            <div className="d-flex align-items-start">
                              <div className={`rounded-circle p-1 me-2 ${notification.unread ? 'bg-primary' : 'bg-secondary'}`} style={{width: '8px', height: '8px', marginTop: '6px'}}></div>
                              <div className="flex-grow-1">
                                <div className="fw-medium small mb-1">{notification.title}</div>
                                <div className="text-muted small mb-1">{notification.message}</div>
                                <small className="text-muted">{notification.time}</small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-2 border-top text-center">
                        <button className="btn btn-sm btn-link">Ver todas las notificaciones</button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* User Menu Dropdown */}
                <div className="position-relative dropdown-container">
                  <button 
                    className="btn btn-outline-secondary d-flex align-items-center"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="bg-primary rounded-circle p-1 me-2">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="d-none d-md-inline">{data.name}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="position-absolute top-100 end-0 mt-2 bg-white border rounded shadow-lg" style={{width: '250px', zIndex: 1050}}>
                      <div className="p-3 border-bottom">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary rounded-circle p-2 me-2">
                            <User size={16} className="text-white" />
                          </div>
                          <div>
                            <div className="fw-medium small">{data.name}</div>
                            <small className="text-muted" style={{fontSize:"13px"}}>{data.email}</small>
                          </div>
                        </div>
                      </div>
                      <div className="p-1">
                        <button className="btn btn-ghost w-100 text-start d-flex align-items-center p-2">
                          <UserCircle size={16} className="me-2" />
                          Mi Perfil
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
          </header>

          {/* Content Area */}
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;