import axios from "axios";
import type { LoginRequest, LoginResponse } from "@/types/data-types";

const API_BASE_URL = "https://portfolio-back-r1hd.onrender.com";
const TOKEN_KEY = "portfolio_jwt_token";

export const authService = {
  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    delete axios.defaults.headers.common["Authorization"];
  },

  login: async (email: string, password: string): Promise<string> => {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/api/auth/login`,
      { email, password } as LoginRequest,
    );
    const token = response.data.token;
    authService.setToken(token);
    return token;
  },

  logout: () => {
    authService.removeToken();
  },

  initializeAuth: () => {
    const token = authService.getToken();
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  },

  isAuthenticated: (): boolean => {
    return !!authService.getToken();
  },
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      authService.removeToken();
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
