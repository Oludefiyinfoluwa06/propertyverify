const API_BASE = process.env.NEXT_PUBLIC_API_URL;

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

function getToken() {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem('pv_token') : null;
  } catch {
    return null;
  }
}

const client: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config: any) => {
  const token = getToken();
  if (token && config.headers && !(config as any).skipAuth) {
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (resp: any) => resp,
  (error: any) => {
    // Normalize axios error to throw something similar to previous implementation
    const err: any = new Error(error?.response?.data?.message || error.message || 'API Error');
    err.status = error?.response?.status;
    err.data = error?.response?.data;
    throw err;
  }
);

type RequestOpts = AxiosRequestConfig & { skipAuth?: boolean };

export const api = {
  get: async (path: string, opts: RequestOpts = {}) => {
    const res = await client.get(path, opts);
    return res.data;
  },
  post: async (path: string, body?: any, opts: RequestOpts = {}) => {
    const res = await client.post(path, body, opts);
    return res.data;
  },
  put: async (path: string, body?: any, opts: RequestOpts = {}) => {
    const res = await client.put(path, body, opts);
    return res.data;
  },
  del: async (path: string, opts: RequestOpts = {}) => {
    const res = await client.delete(path, opts);
    return res.data;
  },
  rawBase: API_BASE,
};

export default api;
