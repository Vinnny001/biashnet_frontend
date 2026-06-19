import axios from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "../utils/constants";
import { storage } from "../utils/storage";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 20000
});

api.interceptors.request.use((config) => {
  const token = storage.get(STORAGE_KEYS.TOKEN);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error?.response?.status === 401) {
      storage.clearAuth([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
      window.dispatchEvent(new Event("biashnet:unauthorized"));
    }

    return Promise.reject(error);
  }
);

export default api;
