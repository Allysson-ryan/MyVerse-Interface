import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function PrivateRoute() {
  const userData = JSON.parse(localStorage.getItem("MyVerse:userData"));
  const token = userData?.token;

  if (!token) return <Navigate to="/entrar" />;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem("MyVerse:userData");
      return <Navigate to="/entrar" />;
    }
  } catch {
    localStorage.removeItem("MyVerse:userData");
    return <Navigate to="/entrar" />;
  }

  return <Outlet />;
}
