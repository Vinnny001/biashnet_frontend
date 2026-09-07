/*
=========================================================
BIASHNET APPLICATION CONFIG
=========================================================
*/

export const APP_NAME =
  import.meta.env.VITE_APP_NAME || "BIASHNET";

export const APP_ENV =
  import.meta.env.VITE_APP_ENV || "development";

export const IS_PRODUCTION =
  APP_ENV === "production";

export const IS_DEVELOPMENT =
  APP_ENV === "development";


/*
=========================================================
MAIN BIASHNET BACKEND
=========================================================

Handles:

- Authentication
- Users
- Products
- Sellers
- Profiles
- General marketplace features
=========================================================
*/

const API_URLS = {

  development:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api",

  production:
    import.meta.env.VITE_API_BASE_URL ||
    "https://biashnet-backend.onrender.com/api",

};

export const API_BASE_URL =
  API_URLS[APP_ENV] ||
  API_URLS.production;


/*
=========================================================
PAYMENT / MARKETPLACE BACKEND
=========================================================

Handles:

- Checkout
- Marketplace orders
- Payment initiation
- M-PESA STK Push
- Payment callbacks
- Payment status
- Order tracking
- Seller settlements
- Withdrawals
=========================================================
*/

const PAYMENT_API_URLS = {
  development:
    import.meta.env.VITE_PAYMENT_API_BASE_URL ||
    "https://biashnet-mpesa-api.onrender.com/api",

  production:
    "https://biashnet-mpesa-api.onrender.com/api",
};

export const PAYMENT_API_BASE_URL =
  PAYMENT_API_URLS[APP_ENV] ||
  PAYMENT_API_URLS.production;

/*
=========================================================
UPLOAD SERVER
=========================================================
*/

export const UPLOAD_API_BASE_URL =
  import.meta.env.VITE_UPLOAD_SERVER_URL ||
  "http://localhost:5050";


/*
=========================================================
DEVELOPMENT SERVER
=========================================================
*/

export const DEV_PORT =
  Number(
    import.meta.env.VITE_DEV_PORT
  ) || 5173;

export const PREVIEW_PORT =
  Number(
    import.meta.env.VITE_PREVIEW_PORT
  ) || 4173;

export const PROXY_TARGET =
  import.meta.env.VITE_PROXY_TARGET ||
  "http://localhost:5000";


/*
=========================================================
USER ROLES
=========================================================
*/

export const USER_ROLES = {

  ADMIN:
    "admin",

  SELLER:
    "seller",

  BUYER:
    "buyer",

};


/*
=========================================================
ROUTES
=========================================================
*/

export const ROUTES = {

  HOME:
    "/",

  LOGIN:
    "/login",

  SIGNUP:
    "/signup",

  FORGOT_PASSWORD:
    "/forgot-password",

  RESET_PASSWORD:
    "/reset-password",


  /*
  -----------------------------------------------
  MARKETPLACE
  -----------------------------------------------
  */

  PRODUCTS:
    "/products",

  PRODUCT_DETAILS:
    "/products/:id",

  SEARCH:
    "/search",

  CART:
    "/cart",


  /*
  -----------------------------------------------
  CHECKOUT / PAYMENT
  -----------------------------------------------
  */

  CHECKOUT:
    "/checkout",

  PAYMENT:
    "/payment",

  PAYMENT_SUCCESS:
    "/payment/success",

  PAYMENT_FAILED:
    "/payment/failed",

  PAYMENT_PENDING:
    "/payment/pending",


  /*
  -----------------------------------------------
  BUYER ORDERS
  -----------------------------------------------
  */

  ORDERS:
    "/orders",

  ORDER_DETAILS:
    "/orders/:id",


  /*
  -----------------------------------------------
  ACCOUNT
  -----------------------------------------------
  */

  PROFILE:
    "/profile",

  NOTIFICATIONS:
    "/notifications",

  CHAT:
    "/chat",


  /*
  -----------------------------------------------
  ADMIN
  -----------------------------------------------
  */

  ADMIN:
    "/admin/dashboard",


  /*
  -----------------------------------------------
  SELLER
  -----------------------------------------------
  */

  SELLER:
    "/seller/dashboard",

  SELLER_PRODUCTS:
    "/seller/products",

  SELLER_ADD_PRODUCT:
    "/seller/products/new",

  SELLER_ORDERS:
    "/seller/orders",

  SELLER_ANALYTICS:
    "/seller/analytics",

  SELLER_CHAT:
    "/seller/chat",

  SELLER_PROFILE:
    "/seller/profile",

  SELLER_PROMOTIONS:
    "/seller/promotions",

  SELLER_FLASH_SALES:
    "/seller/flashsales",

  SELLER_SETTINGS:
    "/seller/settings",

};


/*
=========================================================
STORAGE KEYS
=========================================================
*/

export const STORAGE_KEYS = {

  TOKEN:
    "biashnet.accessToken",

  USER:
    "biashnet.user",

  CART:
    "biashnet.cart",

};


/*
=========================================================
PAYMENT METHODS
=========================================================

Keep these values aligned with backend
paymentConstants.js.
=========================================================
*/

export const PAYMENT_METHODS = {

  MPESA:
    "MPESA",

};


/*
=========================================================
PAYMENT PROVIDERS
=========================================================
*/

export const PAYMENT_PROVIDERS = {

  MPESA:
    "MPESA",

};


/*
=========================================================
PAYMENT TYPES
=========================================================
*/

export const PAYMENT_TYPES = {

  ORDER:
    "ORDER",

};


/*
=========================================================
ORDER STATUS
=========================================================

These values MUST remain synchronized with:

backend/config/paymentConstants.js
=========================================================
*/

export const ORDER_STATUS = {

  /*
  -----------------------------------------------
  PAYMENT
  -----------------------------------------------
  */

  PENDING_PAYMENT:
    "PENDING_PAYMENT",

  PAYMENT_INITIATED:
    "PAYMENT_INITIATED",

  PAID:
    "PAID",


  /*
  -----------------------------------------------
  FULFILLMENT
  -----------------------------------------------
  */

  PROCESSING:
    "PROCESSING",

  SHIPPED:
    "SHIPPED",

  DELIVERED:
    "DELIVERED",


  /*
  -----------------------------------------------
  TERMINAL
  -----------------------------------------------
  */

  CANCELLED:
    "CANCELLED",

  FAILED:
    "FAILED",

};


/*
=========================================================
PAYMENT STATUS
=========================================================

IMPORTANT:

Backend checkout/payment services use:

PENDING
COMPLETED
FAILED
CANCELLED

Do NOT use "PAID" here if backend expects
"COMPLETED".
=========================================================
*/

export const PAYMENT_STATUS = {

  PENDING:
    "PENDING",

  PROCESSING:
    "PROCESSING",

  COMPLETED:
    "COMPLETED",

  FAILED:
    "FAILED",

  CANCELLED:
    "CANCELLED",

};


/*
=========================================================
SELLER PAYMENT STATUS
=========================================================

Used after successful buyer payment.

Seller funds should NOT be released merely because
checkout was created.
=========================================================
*/

export const SELLER_PAYMENT_STATUS = {

  NOT_RELEASED:
    "NOT_RELEASED",

  HELD:
    "HELD",

  RELEASED:
    "RELEASED",

  PAID:
    "PAID",

};


/*
=========================================================
PAYOUT STATUS
=========================================================
*/

export const PAYOUT_STATUS = {

  NOT_RELEASED:
    "NOT_RELEASED",

  PENDING:
    "PENDING",

  PROCESSING:
    "PROCESSING",

  COMPLETED:
    "COMPLETED",

  FAILED:
    "FAILED",

};


/*
=========================================================
STOCK STATUS
=========================================================
*/

export const STOCK_STATUS = {

  NOT_DEDUCTED:
    "NOT_DEDUCTED",

  RESERVED:
    "RESERVED",

  DEDUCTED:
    "DEDUCTED",

  RESTORED:
    "RESTORED",

  FAILED:
    "FAILED",

};


/*
=========================================================
CHECKOUT LIMITS
=========================================================
*/

export const CHECKOUT_LIMITS = {

  /*
  Must match backend checkoutService.
  */

  MAX_ITEMS:
    50,

  MIN_QUANTITY:
    1,

};


/*
=========================================================
CURRENCY
=========================================================
*/

export const CURRENCY = {

  CODE:
    "KES",

  SYMBOL:
    "KSh",

};


/*
=========================================================
PAYMENT API PATHS
=========================================================
*/

export const PAYMENT_ENDPOINTS = {

  CHECKOUT:
    "/payments/checkout",

  INITIATE:
    "/payments/initiate",

  GET_CHECKOUT:
    "/payments/checkout",

};


/*
=========================================================
GENERAL API PATHS
=========================================================
*/

export const API_ENDPOINTS = {

  AUTH:
    "/auth",

  USERS:
    "/users",

  PRODUCTS:
    "/products",

  SELLERS:
    "/sellers",

  PROFILE:
    "/profile",

  NOTIFICATIONS:
    "/notifications",

  CHAT:
    "/chat",

};


/*
=========================================================
CHECKOUT DEFAULTS
=========================================================
*/

export const CHECKOUT_DEFAULTS = {

  PAYMENT_METHOD:
    PAYMENT_METHODS.MPESA,

  CURRENCY:
    CURRENCY.CODE,

  DELIVERY_FEE:
    0,

};


/*
=========================================================
APP EVENTS
=========================================================

Useful for communicating between authentication,
payment and UI components.
=========================================================
*/

export const APP_EVENTS = {

  UNAUTHORIZED:
    "biashnet:unauthorized",

  PAYMENT_PENDING:
    "biashnet:payment-pending",

  PAYMENT_SUCCESS:
    "biashnet:payment-success",

  PAYMENT_FAILED:
    "biashnet:payment-failed",

  ORDER_UPDATED:
    "biashnet:order-updated",

};


/*
=========================================================
M-PESA CONFIGURATION
=========================================================
*/

export const MPESA_CONFIG = {

  PAYMENT_METHOD:
    PAYMENT_METHODS.MPESA,

  PROVIDER:
    PAYMENT_PROVIDERS.MPESA,

  COUNTRY:
    "KE",

  CURRENCY:
    "KES",

};


/*
=========================================================
EXPORT DEFAULT
=========================================================
*/

export default {

  APP_NAME,
  APP_ENV,
  IS_PRODUCTION,
  IS_DEVELOPMENT,

  API_BASE_URL,
  PAYMENT_API_BASE_URL,
  UPLOAD_API_BASE_URL,

  DEV_PORT,
  PREVIEW_PORT,
  PROXY_TARGET,

  USER_ROLES,

  ROUTES,

  STORAGE_KEYS,

  PAYMENT_METHODS,
  PAYMENT_PROVIDERS,
  PAYMENT_TYPES,

  ORDER_STATUS,
  PAYMENT_STATUS,
  SELLER_PAYMENT_STATUS,
  PAYOUT_STATUS,
  STOCK_STATUS,

  CHECKOUT_LIMITS,

  CURRENCY,

  PAYMENT_ENDPOINTS,
  API_ENDPOINTS,

  CHECKOUT_DEFAULTS,

  APP_EVENTS,

  MPESA_CONFIG,

};