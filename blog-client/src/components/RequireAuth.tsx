import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const RequireAuth = ({ redirectPath = "/" }) => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.user) {
    return <Outlet />;
  }

  const userInStorage = localStorage.getItem("user");

  if (userInStorage) {
    auth.user = userInStorage;
    return <Outlet />;
  }

  return <Navigate to={redirectPath} state={{ from: location }} />;
};
