import axios from 'axios';
import { getAuthData } from '../storage';
import { URL } from '@env';

const client = axios.create({
  baseURL: `${URL}`,
});

// Add the auth token to the request headers
client.interceptors.request.use(
  async (config) => {
    const token = await getAuthData();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default client;