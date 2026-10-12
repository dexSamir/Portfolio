import type { LoginResponse } from '@/types/data-types';
import { api } from './http';
import { clearSession, getSessionToken, setSessionToken } from './session';
export const authService = {
  setToken: setSessionToken,
  getToken: getSessionToken,
  removeToken: clearSession,
  login: async (email: string, password: string) => {
    const response = await api.post<LoginResponse>('/api/auth/login', { email: email.trim(), password });
    setSessionToken(response.data.token);
    return response.data.token;
  },
  logout: clearSession,
  isAuthenticated: () => !!getSessionToken(),
};
