import { Navigate, Outlet } from "react-router-dom";

const UserRoute = () => {
  const userType = localStorage.getItem("userType");

  return userType === "user" ? <Outlet /> : <Navigate to="/" replace />;
};

export default UserRoute;
