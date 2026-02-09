import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/loginPage" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
