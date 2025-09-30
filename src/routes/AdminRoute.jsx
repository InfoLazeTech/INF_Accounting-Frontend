import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  return token ? children : <Navigate to="/login" replace />;
};

export default AdminRoute;
