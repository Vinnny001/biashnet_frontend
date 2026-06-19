import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import BuyerLayout from "../layout/BuyerLayout";
import GuestLayout from "../layout/GuestLayout";
import SellerLayout from "../layout/SellerLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import AdminAnalytics from "../pages/admin/Analytics";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminModeration from "../pages/admin/Moderation";
import AdminOrders from "../pages/admin/Orders";
import AdminProducts from "../pages/admin/Products";
import AdminReports from "../pages/admin/Reports";
import AdminSellers from "../pages/admin/Sellers";
import AdminSettings from "../pages/admin/Settings";
import AdminUsers from "../pages/admin/Users";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Login from "../pages/auth/Login";
import ResetPassword from "../pages/auth/ResetPassword";
import Signup from "../pages/auth/Signup";
import Cart from "../pages/buyer/Cart";
import BuyerChat from "../pages/buyer/Chat";
import Checkout from "../pages/buyer/Checkout";
import Home from "../pages/buyer/Home";
import Notifications from "../pages/buyer/Notifications";
import BuyerOrders from "../pages/buyer/Orders";
import OrderTracking from "../pages/buyer/OrderTracking";
import ProductDetails from "../pages/buyer/ProductDetails";
import Products from "../pages/buyer/Products";
import BuyerProfile from "../pages/buyer/Profile";
import SearchResults from "../pages/buyer/SearchResults";
import Wishlist from "../pages/buyer/Wishlist";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import FAQ from "../pages/public/FAQ";
import NotFound from "../pages/public/NotFound";
import Privacy from "../pages/public/Privacy";
import ServerError from "../pages/public/ServerError";
import Terms from "../pages/public/Terms";
import AddProduct from "../pages/seller/AddProduct";
import SellerAnalytics from "../pages/seller/Analytics";
import SellerChat from "../pages/seller/Chat";
import SellerDashboard from "../pages/seller/Dashboard";
import EditProduct from "../pages/seller/EditProduct";
import MyProducts from "../pages/seller/MyProducts";
import SellerProfile from "../pages/seller/Profile";
import Promotions from "../pages/seller/Promotions";
import SellerOrders from "../pages/seller/SellerOrders";
import SellerSettings from "../pages/seller/Settings";
import SharedProfile from "../pages/shared/Profile";
import SharedSettings from "../pages/shared/Settings";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/500" element={<ServerError />} />
      </Route>

      <Route element={<BuyerLayout />}>
        <Route index element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<BuyerLayout />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<BuyerOrders />} />
          <Route path="/orders/:id" element={<OrderTracking />} />
          <Route path="/chat" element={<BuyerChat />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<BuyerProfile />} />
          <Route path="/account/profile" element={<SharedProfile />} />
          <Route path="/account/settings" element={<SharedSettings />} />
        </Route>
      </Route>

      <Route element={<RoleRoute allow={["seller", "admin"]} />}>
        <Route path="/seller" element={<SellerLayout />}>
          <Route index element={<Navigate to="/seller/dashboard" replace />} />
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="products" element={<MyProducts />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="products/:id/edit" element={<EditProduct />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="analytics" element={<SellerAnalytics />} />
          <Route path="chat" element={<SellerChat />} />
          <Route path="profile" element={<SellerProfile />} />
          <Route path="promotions" element={<Promotions />} />
          <Route path="settings" element={<SellerSettings />} />
        </Route>
      </Route>

      <Route element={<RoleRoute allow={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="sellers" element={<AdminSellers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="moderation" element={<AdminModeration />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
