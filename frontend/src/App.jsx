import { useState } from 'react'
import CustomerDashboard from './components/CustomerDashboard.jsx'
import EmployeeDashboard from './components/EmployeeDashboard.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import SignIn from './components/SignIn.jsx'
import SignUp from './components/SignUp.jsx'
import ForgotPassword from './components/ForgotPassword.jsx'
import ResetPassword from './components/ResetPassword.jsx'
import RegisterVerification from './components/RegisterVerification.jsx'
import VerifyEmail from './components/VerifyEmail.jsx'

import TableEmployee from './components/TableEmployee.jsx'
import InformationEmployee from './components/InformationEmployee.jsx'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/customer/dashboard/:id" element={<CustomerDashboard />}>
          <Route index element={<TableEmployee />} />
          <Route path="new/:employeeId" element={<InformationEmployee />} />
        </Route>

        <Route path="/employee/dashboard/:id" element={<EmployeeDashboard />} />
        <Route path="/admin/dashboard/:id" element={<AdminDashboard />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/register-verification" element={<RegisterVerification />} />
      </Routes>
    </Router>
  )
}

export default App
