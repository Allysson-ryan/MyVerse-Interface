import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Services/apiService";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function Cadastrar() {
  const navigate = useNavigate();

  // Estados do formulário
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    senha: "",
    confirmSenha: "",
  });

  // Estados do feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // success | error | warning | info
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmSenha) {
      return setSnackbar({
        open: true,
        message: "As senhas não coincidem.",
        severity: "error",
      });
    }

    try {
      const res = await api.post("/register", {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        senha: formData.senha,
      });

      // Registro bem-sucedido
      localStorage.setItem("token", res.data.token);

      setSnackbar({
        open: true,
        message: "Cadastro realizado com sucesso!",
        severity: "success",
      });

      setTimeout(() => navigate("/entrar"), 1500);
    } catch (err) {
      const msg =
        err.response?.data?.error || "Erro ao cadastrar. Tente novamente.";
      setSnackbar({
        open: true,
        message: msg,
        severity: "error",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brandiceblue px-4">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-md p-6 sm:p-8">
        <h1 className="text-2xl font-semibold text-black text-center mb-6">
          Registrar
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Nome */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-brandsteel mb-1"
            >
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Seu nome completo"
              className="block w-full border border-brandsteel rounded-md py-2 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-brandprimary"
            />
          </div>

          {/* Email */}
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
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Digite seu email"
              className="block w-full border border-brandsteel rounded-md py-2 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-brandprimary"
            />
          </div>

          {/* Senha */}
          <div>
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-brandsteel mb-1"
            >
              Senha
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              placeholder="Digite sua senha"
              className="block w-full border border-brandsteel rounded-md py-2 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-brandprimary"
            />
          </div>

          {/* Confirmar Senha */}
          <div>
            <label
              htmlFor="confirmSenha"
              className="block text-sm font-medium text-brandsteel mb-1"
            >
              Confirme a senha
            </label>
            <input
              type="password"
              id="confirmSenha"
              name="confirmSenha"
              value={formData.confirmSenha}
              onChange={handleChange}
              required
              placeholder="Confirme sua senha"
              className="block w-full border border-brandsteel rounded-md py-2 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-brandprimary"
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="w-full cursor-pointer inline-flex items-center justify-center py-2.5 rounded-full bg-brandmediumblue text-white font-medium hover:bg-branddeepblue transition-colors duration-200"
          >
            Registrar
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-brandsteel cursor-pointer">
          Já tenho uma conta.{" "}
          <a href="/entrar" className="text-brandprimary hover:underline">
            Entrar
          </a>
        </p>
      </div>

      {/* Snackbar de feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
