export const APP_NAME = import.meta.env.VITE_APP_NAME || "App name";
const APP_ENV = import.meta.env.VITE_APP_ENV || "dev_mode";

const API_URLS = {
  development: "http://localhost:5000/api",
  production: "https://biashnet-backend.onrender.com/api",
};

export const API_BASE_URL = API_URLS[APP_ENV] || API_URLS.production;
export const USER_ROLES = {
  ADMIN: "admin",
  SELLER: "seller",
  BUYER: "buyer"
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PROFILE: "/profile",
  PRODUCTS: "/products",
  CART: "/cart",
  ORDERS: "/orders",
  ADMIN: "/admin/dashboard",
  SELLER: "/seller/dashboard"
};

export const STORAGE_KEYS = {
  TOKEN: "biashnet.accessToken",
  USER: "biashnet.user",
  CART: "biashnet.cart"
};
