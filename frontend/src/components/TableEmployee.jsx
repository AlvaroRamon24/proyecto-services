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
import { useNavigate, useOutletContext } from 'react-router-dom';
// Importar Material-UI components
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import '../App.css';

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 3.5, // 4.5 items de altura
    },
  },
};

export default function TableEmployee() {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useOutletContext();
  const navigate = useNavigate();
  
  // Estados para filtros
  const [cityFilter, setCityFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');

  useEffect(() => {
    const getDataCustomer = async () => {
      try {
        const response = await axios("http://localhost:4500/employee/");
        if (response.status === 200) {
          setEmployeeData(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error al conectar a la API:', error);
        setLoading(false);
      }
    }
    getDataCustomer();
  }, [])

  const handleInformation = (employeeId) => {
    navigate(`/customer/dashboard/${id}/new/${employeeId}`);
  }

  // Handlers para los cambios en los select
  const handleCityChange = (event) => {
    setCityFilter(event.target.value);
  };

  const handleDistrictChange = (event) => {
    setDistrictFilter(event.target.value);
  };

  const handleServiceChange = (event) => {
    setServiceFilter(event.target.value);
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
    <div className="row">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0 d-flex align-items-center">
                <Table size={18} className="me-2 text-primary" />
                Lista de Trabajadores({employeeData.length})
              </h6>
              <div className="d-flex align-items-center">
                <small className="text-muted me-3">Mostrando {employeeData.length} de {employeeData.length} usuarios</small>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            {/* Filtros con Material-UI */}
            <div className="row p-3">
              <div className="col-md-4 mb-2">
                <FormControl sx={{ minWidth: '100%' }} size="small">
                  <InputLabel id="city-select-label">Ciudades</InputLabel>
                  <Select
                    labelId="city-select-label"
                    id="city-select"
                    value={cityFilter}
                    label="Ciudades"
                    onChange={handleCityChange}
                    MenuProps={menuProps}
                  >
                    <MenuItem value="">
                      <em>Todas las ciudades</em>
                    </MenuItem>
                    {[...new Set(employeeData.map(emp => emp.city))].map(city => (
                      <MenuItem key={city} value={city}>{city}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              
              <div className="col-md-4 mb-2">
                <FormControl sx={{ minWidth: '100%' }} size="small">
                  <InputLabel id="district-select-label">Distritos</InputLabel>
                  <Select
                    labelId="district-select-label"
                    id="district-select"
                    value={districtFilter}
                    label="Distritos"
                    onChange={handleDistrictChange}
                    MenuProps={menuProps}
                  >
                    <MenuItem value="">
                      <em>Todos los distritos</em>
                    </MenuItem>
                    {[...new Set(employeeData.map(emp => emp.district))].map(district => (
                      <MenuItem key={district} value={district}>{district}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              
              <div className="col-md-4 mb-2">
                <FormControl sx={{ minWidth: '100%' }} size="small">
                  <InputLabel id="service-select-label">Servicios</InputLabel>
                  <Select
                    labelId="service-select-label"
                    id="service-select"
                    value={serviceFilter}
                    label="Servicios"
                    onChange={handleServiceChange}
                    MenuProps={menuProps}
                  >
                    <MenuItem value="">
                      <em>Todos los servicios</em>
                    </MenuItem>
                    {[...new Set(
                      employeeData.flatMap(emp =>
                        Object.keys(emp.services || {}).map(service => service.toLowerCase())
                      )
                    )].map((service, i) => (
                      <MenuItem key={i} value={service}>{service}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Tabla */}
            <div className="table-responsive">
              <table className="table table-hover custom-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="border-0 py-3">Id</th>
                    <th className="border-0 py-3">Usuario</th>
                    <th className="border-0 py-3">Contacto</th>
                    <th className="border-0 py-3">Ciudad</th>
                    <th className="border-0 py-3">Distrito</th>
                    <th className='border-0 py-3'>Servicios</th>
                    <th className="border-0 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeData
                    .filter(user =>
                      (cityFilter === '' || user.city?.toLowerCase() === cityFilter.toLowerCase()) &&
                      (districtFilter === '' || user.district?.toLowerCase() === districtFilter.toLowerCase()) &&
                      (serviceFilter === '' || (
                        user.services &&
                        Object.keys(user.services).some(service => service.toLowerCase() === serviceFilter.toLowerCase())
                      ))
                    )
                    .map((user, index) => (
                      <tr key={`employee-${user._id}`}
                        onClick={() => handleInformation(user._id)}
                        className="cursor-pointer"
                      >
                        <td className="py-3">
                          <span className="badge bg-light text-dark">{index + 1}</span>
                        </td>
                        <td className="py-3">
                          <div className="d-flex align-items-center">
                            <div className="me-3" style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              overflow: 'hidden',
                              backgroundColor: '#E3F2FD'
                            }}>
                              <img
                                src={user.photo}
                                alt="Foto del trabajador"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                            </div>
                            <div>
                              <div className="fw-medium" style={{fontSize:"15px"}}><strong>{user.name}</strong></div>
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
                        <td className="py-3" style={{fontSize:"14px"}}>{user.city}</td>
                        <td className="py-3">
                          <small className="text-muted">{user.district}</small>
                        </td>
                        <td className="py-3" style={{fontSize: '14px'}}>
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
  )
}