import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CircularProgress, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";

export default function Dashboard() {
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
    <>
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
      <div className="flex items-center justify-center flex-col gap-[10px] min-h-screen bg-gray-100">
        <CircularProgress />
        <Typography variant="h6" component="h2" className="text-center">
          Redirecionando...
        </Typography>
      </div>
    </>
  );
}
