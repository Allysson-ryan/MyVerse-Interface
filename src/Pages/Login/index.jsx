import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "../../assets/GoogleIcon.png";
import { googleLogin, loginUser } from "../../api/auth";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";

export default function Login() {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleGoogleLogin = () => {
    googleLogin();
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const openSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const senha = e.target.password.value;

    try {
      const response = await loginUser(email, senha);
      const { id, nome, token } = response.data;

      const userData = {
        id,
        nome,
        token,
      };

      localStorage.setItem("MyVerse:userData", JSON.stringify(userData));
      navigate("/");
    } catch (err) {
      openSnackbar("Erro ao logar:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brandiceblue px-4">
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
      <div className="bg-white w-full max-w-sm rounded-lg shadow-md p-9 sm:p-9 ">
        <h1 className="text-2xl font-semibold text-black text-center mb-6">
          Entrar
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-brandsteel mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="digite seu email"
              className="
                block w-full 
                border border-brandsteel rounded-md 
                py-2 px-3 
                text-sm text-black 
                focus:outline-none focus:ring-2 focus:ring-brandprimary
                "
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-brandsteel mb-1"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="digite sua senha"
              className="
                block w-full 
                border border-brandsteel rounded-md 
                py-2 px-3 
                text-sm text-black 
                focus:outline-none focus:ring-2 focus:ring-brandprimary
                "
              required
            />
          </div>
          <button
            type="submit"
            className="
              w-full 
              cursor-pointer
              inline-flex items-center justify-center 
              py-2.5 
              rounded-full 
              bg-brandmediumblue 
              text-white font-medium 
              hover:bg-branddeepblue 
              transition-colors duration-200
            "
          >
            Entrar
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-brandsteel cursor-pointer">
          Não tenho uma conta.{" "}
          <a href="/cadastrar" className="text-brandprimary hover:underline">
            Registrar
          </a>
        </p>

        <div className="mt-9 flex items-center">
          <div className="flex-1 h-[1.6px] bg-brandlightgray"></div>
          <span className="px-2 text-xs text-brandsteel">
            acesso rápido com
          </span>
          <div className="flex-1 h-[1.6px] bg-brandlightgray"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="
            mt-6 w-full 
            cursor-pointer
            flex items-center justify-center 
            border border-brandsteel rounded-md 
            py-2 
            bg-white 
            hover:bg-brandiceblue 
            transition-colors duration-200
          "
        >
          <img src={GoogleIcon} alt="Google" className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium text-black">GOOGLE</span>
        </button>
      </div>
    </div>
  );
}
