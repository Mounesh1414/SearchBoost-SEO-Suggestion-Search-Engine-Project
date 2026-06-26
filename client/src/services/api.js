import axios from 'axios';

const http = axios.create({ baseURL: '/api' });

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('sb_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ── AUTH ── */
export const authAPI = {
  register: async (username, email, password) => {
    const r = await http.post('/auth/register', { username, email, password });
    return r.data;
  },
  login: async (email, password) => {
    const r = await http.post('/auth/login', { email, password });
    return r.data;
  },
  getMe: async () => {
    const r = await http.get('/auth/me');
    return r.data;
  }
};

/* ── SEO ── */
export const seoAPI = {
  analyze: async (url) => {
    const r = await http.post('/seo/analyze', { url });
    return r.data;
  },
  keywords: async (keyword) => {
    const r = await http.get('/seo/keywords', { params: { keyword } });
    return r.data;
  },
  history: async (page = 1, limit = 10) => {
    const r = await http.get('/seo/history', { params: { page, limit } });
    return r.data;
  },
  adminStats: async () => {
    const r = await http.get('/seo/admin/stats');
    return r.data;
  }
};

export default http;
