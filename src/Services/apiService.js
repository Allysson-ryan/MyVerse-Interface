import axios from "axios";
import { getToken } from "../utils/authStorage";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getToken()) {
      localStorage.removeItem("MyVerse:userData");
      window.location.href = "/entrar";
    }
    return Promise.reject(error);
  }
);

export const createReview = async (dados) => {
  try {
    const response = await api.post("/reviews", dados);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erro ao criar resenha.");
  }
};

export const listReviews = async () => {
  const response = await api.get("/reviews");
  return response.data;
};

export const getLatestReviews = async () => {
  try {
    const response = await api.get("/reviews/latest");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Erro ao buscar últimas resenhas."
    );
  }
};

export const getReviewById = async (id) => {
  try {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erro ao buscar resenha.");
  }
};

export const updateReview = async (id, dados) => {
  try {
    const response = await api.put(`/reviews/${id}`, dados);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Erro ao atualizar resenha."
    );
  }
};

export const deleteReview = async (id) => {
  try {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Erro ao deletar resenha."
    );
  }
};

export const listAllCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Erro ao buscar categorias."
    );
  }
};

export const createCategory = async (data) => {
  try {
    const response = await api.post("/categories", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Erro ao criar a categoria."
    );
  }
};

export const updateCategory = async (id, data) => {
  try {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Erro ao atualizar a categoria."
    );
  }
};

export const deleteCategory = async (id) => {
  try {
    await api.delete(`/categories/${id}`);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Erro ao deletar a categoria."
    );
  }
};

export const listWishlist = async () => {
  try {
    const response = await api.get("/wishlist");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Erro ao buscar lista de desejos."
    );
  }
};

export const createWishlist = async (dados) => {
  try {
    const response = await api.post("/wishlist", dados);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Erro ao adicionar à lista de desejos."
    );
  }
};

export const deleteWishlist = async (id) => {
  try {
    const response = await api.delete(`/wishlist/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Erro ao deletar item da lista."
    );
  }
};

export const updateWishlist = async (id, dados) => {
  try {
    const response = await api.put(`/wishlist/${id}`, dados);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Erro ao atualizar item da lista."
    );
  }
};

export default api;
