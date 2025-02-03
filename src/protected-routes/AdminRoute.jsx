import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const userType = localStorage.getItem("userType");

  return userType === "admin" ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
