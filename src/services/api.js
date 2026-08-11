// src/services/api.js

import axios from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "../utils/constants";
import { storage } from "../utils/storage";

/*
|--------------------------------------------------------------------------
| Main Biashnet API
|--------------------------------------------------------------------------
*/

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 20000,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = storage.get(STORAGE_KEYS.TOKEN);

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response.data,

  (error) => {
    if (error?.response?.status === 401) {
      storage.clearAuth([
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.USER
      ]);

      window.dispatchEvent(
        new Event("biashnet:unauthorized")
      );
    }

    return Promise.reject(error);
  }
);


/*
|--------------------------------------------------------------------------
| Upload Server API
|--------------------------------------------------------------------------
|
| The upload server is separate from the main Biashnet API.
|
| Authentication uses the SAME JWT returned by the main backend.
|
| No Firebase.
| No Firebase token.
| No UPLOAD_API_KEY in the frontend.
|
*/

const UPLOAD_SERVER_URL =
  import.meta.env.VITE_UPLOAD_SERVER_URL ||
  "http://localhost:5050";

const uploadApi = axios.create({
  baseURL: UPLOAD_SERVER_URL,
  timeout: 60000
});

uploadApi.interceptors.request.use((config) => {
  const token = storage.get(STORAGE_KEYS.TOKEN);

  if (!token) {
    return Promise.reject(
      new Error("You must be logged in to upload.")
    );
  }

  config.headers = config.headers || {};
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

uploadApi.interceptors.response.use(
  (response) => response.data,

  (error) => {
    if (error?.response?.status === 401) {
      storage.clearAuth([
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.USER
      ]);

      window.dispatchEvent(
        new Event("biashnet:unauthorized")
      );
    }

    return Promise.reject(error);
  }
);


/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
|
| Existing code continues using:
|
|     import api from "../services/api";
|
| Upload code uses:
|
|     import { uploadApi } from "../services/api";
|
*/

export { uploadApi };

export default api;