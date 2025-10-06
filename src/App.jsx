import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import CompanyDetail from "./pages/auth/CompanyDetail";
import PublicRoute from "./routes/PublicRoute";
import AdminRoute from "./routes/AdminRoute";
import Customer from "./pages/customer/Customer";
import AddCustomer from "./pages/customer/AddCustomer";
import Profile from "./pages/settings/Profile";
import AppLayout from "./component/layout/AppLayout";
import SignupOTP from "./pages/auth/SignupOtp";
import AddItem from "./pages/item/AddItem";
import Item from "./pages/item/Item";
import CustomerView from "./pages/customer/CustomerView";
import ItemView from "./pages/item/ItemView";
import Bill from "./pages/bill/bill";
import AddBill from "./pages/bill/AddBill";
// import BillView from "./pages/bill/BillView";
import Invoice from "./pages/invoice/Invoice";
import AddInvoice from "./pages/invoice/AddInvoice";
import InvoiceView from "./pages/invoice/InvoiceView";

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
          <Route path="/customer/view/:customerId" element={<CustomerView />} />

          <Route path="profile" element={<Profile />} />
          <Route path="item" element={<Item />} />
          <Route path="item/add" element={<AddItem />} />
          <Route path="item/edit/:itemId" element={<AddItem />} />
          <Route path="/item/view/:itemId" element={<ItemView />} />

          <Route path="bill" element={<Bill />} />
          <Route path="bill/add" element={<AddBill />} />
          <Route path="bill/edit/:billId" element={<AddBill />} />
          {/* <Route path="/bill/view/:billId" element={<BillView />} /> */}

          
          <Route path="invoice" element={<Invoice/>} />
          <Route path="invoice/add" element={<AddInvoice />} />
          <Route path="invoice/edit/:invoiceId" element={<AddInvoice />} />
          <Route path="/invoice/view/:invoiceId" element={<InvoiceView />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}
