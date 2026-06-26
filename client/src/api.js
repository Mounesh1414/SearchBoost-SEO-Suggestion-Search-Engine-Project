import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const getSuggestions = async (keyword) => {
  const response = await api.get('/suggestions', {
    params: { keyword, limit: 12 }
  });
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/suggestions/history');
  return response.data;
};
