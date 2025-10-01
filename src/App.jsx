import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import CompanyDetail from "./pages/auth/CompanyDetail";
import PublicRoute from "./routes/PublicRoute";
import AdminRoute from "./routes/AdminRoute";
import Customer from "./pages/customer/Customer";
import AddCustomer from "./pages/customer/AddCustomer";
import EditCustomer from "./pages/customer/EditCustomer";
import Profile from "./pages/settings/Profile";
import AppLayout from "./component/layout/AppLayout";
import SignupOTP from "./pages/auth/SignupOtp";
import AddItem from "./pages/item/AddItem";
import Item from "./pages/item/Item";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/sign"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/signup/otp"
          element={
            <PublicRoute>
              <SignupOTP />
            </PublicRoute>
          }
        />
        <Route
          path="/signup/company"
          element={
            <PublicRoute>
              <CompanyDetail />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <AdminRoute>
              <AppLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="customer" element={<Customer />} />
          <Route path="customer/add" element={<AddCustomer />} />
          <Route path="customer/edit/:customerId" element={<AddCustomer />} />
          <Route path="profile" element={<Profile />} />
          <Route path="item" element={<Item />} />
          <Route path="item/add" element={<AddItem/>}/>
             <Route path="item/edit/:itemId" element={<AddItem/>}/>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
