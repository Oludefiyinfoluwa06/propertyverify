import api from './api';

const TOKEN_KEY = 'pv_token';

export function setToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    // ignore
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    // ignore
  }
}

export async function login(email: string, password: string) {
  const payload = await api.post('/api/auth/login', { email, password }, { skipAuth: true });
  const token = payload?.data?.token || payload?.token || null;
  if (token) setToken(token);
  return payload;
}

export async function register(payload: { name: string; phone: string; email: string; password: string }) {
  const res = await api.post('/api/auth/register', payload, { skipAuth: true });
  const token = res?.data?.token || res?.token || null;
  if (token) setToken(token);
  return res;
}

export async function getCurrentUser() {
  return api.get('/api/auth/me');
}

const AuthLib = {
  setToken,
  getToken,
  clearToken,
  login,
  register,
  getCurrentUser,
};

export default AuthLib;
