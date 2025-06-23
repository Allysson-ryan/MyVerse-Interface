import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const loginUser = async (email, senha) => {
  return api.post("/login", { email, senha });
};

export const registerUser = async (name, email, senha) => {
  return api.post("/register", { name, email, senha });
};

export const googleLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
};
