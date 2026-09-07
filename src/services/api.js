import axios from "axios";

import {
  API_BASE_URL,
  PAYMENT_API_BASE_URL,
  STORAGE_KEYS,
} from "../utils/constants";

import { storage } from "../utils/storage";


/*
|--------------------------------------------------------------------------
| BIASHNET API CONFIGURATION
|--------------------------------------------------------------------------
|
| MAIN API
|   Users
|   Authentication
|   Products
|   Sellers
|   Profiles
|   Marketplace
|
| PAYMENT API
|   Checkout
|   M-PESA
|   Orders
|   Withdrawals
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| AUTH TOKEN
|--------------------------------------------------------------------------
*/

function getAuthToken() {

  try {

    return storage.get(
      STORAGE_KEYS.TOKEN
    );

  } catch (error) {

    console.error(
      "Failed to read authentication token:",
      error
    );

    return null;

  }

}


/*
|--------------------------------------------------------------------------
| ATTACH AUTHENTICATION
|--------------------------------------------------------------------------
|
| Every protected request receives:
|
| Authorization: Bearer <Firebase ID token>
|
|--------------------------------------------------------------------------
*/

function attachAuth(config) {

  const token =
    getAuthToken();


  if (token) {

    config.headers =
      config.headers || {};


    config.headers.Authorization =
      `Bearer ${token}`;

  }


  return config;

}


/*
|--------------------------------------------------------------------------
| HANDLE UNAUTHORIZED
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| This is Android / React Native.
|
| We DO NOT use:
|
| window.dispatchEvent()
|
| Instead, authentication state can be handled by the
| application's auth layer/navigation layer.
|
|--------------------------------------------------------------------------
*/

function handleUnauthorized(error) {

  if (
    error?.response?.status === 401
  ) {

    try {

      storage.clearAuth([

        STORAGE_KEYS.TOKEN,

        STORAGE_KEYS.USER,

      ]);

    } catch (storageError) {

      console.error(
        "Failed to clear authentication:",
        storageError
      );

    }

  }


  return Promise.reject(error);

}


/*
|--------------------------------------------------------------------------
| NORMALIZE API ERROR
|--------------------------------------------------------------------------
|
| Makes errors easier for checkout/payment screens
| to display.
|
|--------------------------------------------------------------------------
*/

export function getApiErrorMessage(error) {

  /*
  ------------------------------------------------------
  Backend error
  ------------------------------------------------------
  */

  if (
    error?.response?.data?.message
  ) {

    return String(
      error.response.data.message
    );

  }


  /*
  ------------------------------------------------------
  Axios error
  ------------------------------------------------------
  */

  if (
    error?.message
  ) {

    return String(
      error.message
    );

  }


  /*
  ------------------------------------------------------
  Fallback
  ------------------------------------------------------
  */

  return "Something went wrong. Please try again.";

}


/*
|--------------------------------------------------------------------------
| MAIN BIASHNET API
|--------------------------------------------------------------------------
|
| BASE:
|
| API_BASE_URL
|
| Examples:
|
| GET  /products
| GET  /users/me
| POST /auth/login
|
|--------------------------------------------------------------------------
*/

const api = axios.create({

  baseURL:
    API_BASE_URL,

  headers: {

    "Content-Type":
      "application/json",

    Accept:
      "application/json",

  },

  timeout:
    20000,

});


/*
|--------------------------------------------------------------------------
| MAIN API REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(

  (config) => {

    return attachAuth(
      config
    );

  },

  (error) => {

    return Promise.reject(
      error
    );

  }

);


/*
|--------------------------------------------------------------------------
| MAIN API RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(

  (response) => {

    return response.data;

  },

  handleUnauthorized

);


/*
|--------------------------------------------------------------------------
| PAYMENT / M-PESA API
|--------------------------------------------------------------------------
|
| BASE:
|
| https://biashnet-mpesa-api.onrender.com/api
|
| Backend routes:
|
| POST /payments/checkout
| GET  /payments/checkout/:orderId
| POST /payments/initiate
|
| GET  /orders
| GET  /orders/my
| GET  /orders/:orderId
|
| POST /withdrawals
|
|--------------------------------------------------------------------------
*/

const paymentApi = axios.create({

  baseURL:
    PAYMENT_API_BASE_URL,

  headers: {

    "Content-Type":
      "application/json",

    Accept:
      "application/json",

  },

  timeout:
    30000,

});


/*
|--------------------------------------------------------------------------
| PAYMENT REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
*/

paymentApi.interceptors.request.use(

  (config) => {

    return attachAuth(
      config
    );

  },

  (error) => {

    return Promise.reject(
      error
    );

  }

);


/*
|--------------------------------------------------------------------------
| PAYMENT RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
*/

paymentApi.interceptors.response.use(

  (response) => {

    return response.data;

  },

  handleUnauthorized

);


/*
|--------------------------------------------------------------------------
| UPLOAD SERVER
|--------------------------------------------------------------------------
|
| Used for:
|
| - Product images
| - Seller images
| - Marketplace uploads
|
|--------------------------------------------------------------------------
*/

const UPLOAD_SERVER_URL =
  import.meta.env?.VITE_UPLOAD_SERVER_URL ||
  "http://localhost:5050";


const uploadApi = axios.create({

  baseURL:
    UPLOAD_SERVER_URL,

  timeout:
    60000,

});


/*
|--------------------------------------------------------------------------
| UPLOAD AUTHENTICATION
|--------------------------------------------------------------------------
*/

uploadApi.interceptors.request.use(

  (config) => {

    const token =
      getAuthToken();


    if (!token) {

      return Promise.reject(

        new Error(
          "You must be logged in to upload."
        )

      );

    }


    config.headers =
      config.headers || {};


    config.headers.Authorization =
      `Bearer ${token}`;


    return config;

  },

  (error) => {

    return Promise.reject(
      error
    );

  }

);


/*
|--------------------------------------------------------------------------
| UPLOAD RESPONSE
|--------------------------------------------------------------------------
*/

uploadApi.interceptors.response.use(

  (response) => {

    return response.data;

  },

  handleUnauthorized

);


/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

export {

  api,

  paymentApi,

  uploadApi,

};


export default api;