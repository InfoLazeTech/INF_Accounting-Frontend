  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import About from './pages/About';
  import Home from './pages/Home';
  import Login from './pages/Login';
  import Signup from './pages/SignUp';
  import CompanyDetail from './pages/CompanyDetail';
  import SignupOTP from './pages/SignupOtp';
  import DashboardLayout from './component/DashboardLayout';
  import PublicRoute from './routes/PublicRoute';
  import AdminRoute from './routes/AdminRoute';
  import Customer from './pages/Customer';
  import AddCustomer from './pages/AddCustomer';
  import EditCustomer from './pages/EditCustomer';
import SettingsLayout from './pages/settings/SettingsLayout';
import Profile from './pages/settings/Profile';

  export default function App() {
    return (
      <Router>
        <Routes>

          {/* Public routes (no sidebar) */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }/>
          <Route path="/sign" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }/>
          <Route path="/signup/otp" element={
            <PublicRoute>
              <SignupOTP />
            </PublicRoute>
          }/>
          <Route path="/signup/company" element={
            <PublicRoute>
              <CompanyDetail />
            </PublicRoute>
          }/>

          {/* Dashboard/Admin routes (with sidebar) */}
          <Route path="/dashboard/*" element={
            <AdminRoute>
              <DashboardLayout />
            </AdminRoute>
          }>
            <Route index element={<Home />} />
            {/* <Route path="about" element={<About />} /> */}
            <Route path="customer" element={<Customer />} /> 
            <Route path="customer/add" element={<AddCustomer />} />
            <Route path="customer/edit/:id" element={<EditCustomer />} />
            <Route path="profile" element={<Profile />} /> 
        </Route>
          {/* Optional: redirect root to login */}
          <Route path="/" element={<Login />} />

        </Routes>
      </Router>
    );
  }
