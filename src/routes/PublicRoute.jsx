import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  return !token ? children : <Navigate to="/" replace />;
};

export default PublicRoute;
