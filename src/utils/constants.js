export const APP_NAME = import.meta.env.VITE_APP_NAME || "Biashnet";
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

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
