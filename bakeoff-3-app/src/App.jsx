import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import LoanOfficerDashboard from './pages/LoanOfficerDashboard'
import CreateApplication from './pages/CreateApplication'
import CreditManagerDashboard from './pages/CreditManagerDashboard'
import ReviewApplication from './pages/ReviewApplication'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard/lo" element={<LoanOfficerDashboard />} />
        <Route path="/applications/create" element={<CreateApplication />} />
        <Route path="/dashboard/cm" element={<CreditManagerDashboard />} />
        <Route path="/underwriting/:id" element={<ReviewApplication />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App