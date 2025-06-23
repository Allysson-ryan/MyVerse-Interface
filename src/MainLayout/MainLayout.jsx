import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const openSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userData = {
          id: decoded.id,
          nome: decoded.nome,
          token: token,
        };

        localStorage.setItem("MyVerse:userData", JSON.stringify(userData));
        navigate("/");
      } catch (error) {
        openSnackbar("Erro ao decodificar token:", error);
      }
    }
  }, [location.search, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center flex-col w-[100%]">
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Header />
      <main className="flex-1 pt-[64px] w-[100%]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
