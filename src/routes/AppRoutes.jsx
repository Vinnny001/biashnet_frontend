import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import BuyerLayout from "../layout/BuyerLayout";
import GuestLayout from "../layout/GuestLayout";
import SellerLayout from "../layout/SellerLayout";
import Loading from "../components/common/Loading";
import RoleRoute from "./RoleRoute";

const AdminAnalytics = lazy(() => import("../pages/admin/Analytics"));
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const AdminModeration = lazy(() => import("../pages/admin/Moderation"));
const AdminOrders = lazy(() => import("../pages/admin/Orders"));
const AdminProducts = lazy(() => import("../pages/admin/Products"));
const AdminReports = lazy(() => import("../pages/admin/Reports"));
const AdminSellers = lazy(() => import("../pages/admin/Sellers"));
const AdminSettings = lazy(() => import("../pages/admin/Settings"));
const AdminUsers = lazy(() => import("../pages/admin/Users"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const Login = lazy(() => import("../pages/auth/Login"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const Signup = lazy(() => import("../pages/auth/Signup"));
const Cart = lazy(() => import("../pages/buyer/Cart"));
const BuyerChat = lazy(() => import("../pages/buyer/Chat"));
const Checkout = lazy(() => import("../pages/buyer/Checkout"));
const Home = lazy(() => import("../pages/buyer/Home"));
const Notifications = lazy(() => import("../pages/buyer/Notifications"));
const BuyerOrders = lazy(() => import("../pages/buyer/Orders"));
const OrderTracking = lazy(() => import("../pages/buyer/OrderTracking"));
const ProductDetails = lazy(() => import("../pages/buyer/ProductDetails"));
const Products = lazy(() => import("../pages/buyer/Products"));
const BuyerProfile = lazy(() => import("../pages/buyer/Profile"));
const SearchResults = lazy(() => import("../pages/buyer/SearchResults"));
const Wishlist = lazy(() => import("../pages/buyer/Wishlist"));
const About = lazy(() => import("../pages/public/About"));
const Contact = lazy(() => import("../pages/public/Contact"));
const FAQ = lazy(() => import("../pages/public/FAQ"));
const NotFound = lazy(() => import("../pages/public/NotFound"));
const Privacy = lazy(() => import("../pages/public/Privacy"));
const ServerError = lazy(() => import("../pages/public/ServerError"));
const Terms = lazy(() => import("../pages/public/Terms"));
const AddProduct = lazy(() => import("../pages/seller/AddProduct"));
const SellerAnalytics = lazy(() => import("../pages/seller/Analytics"));
const SellerChat = lazy(() => import("../pages/seller/Chat"));
const SellerDashboard = lazy(() => import("../pages/seller/Dashboard"));
const EditProduct = lazy(() => import("../pages/seller/EditProduct"));
const MyProducts = lazy(() => import("../pages/seller/MyProducts"));
const SellerProfile = lazy(() => import("../pages/seller/Profile"));
const Promotions = lazy(() => import("../pages/seller/Promotions"));
const SellerOrders = lazy(() => import("../pages/seller/SellerOrders"));
const SellerSettings = lazy(() => import("../pages/seller/Settings"));
const SharedProfile = lazy(() => import("../pages/shared/Profile"));
const SharedSettings = lazy(() => import("../pages/shared/Settings"));
const RoleRedirect = lazy(() => import("./RoleRedirect"));

const pageFallback = <Loading label="Loading page..." />;
const withSuspense = (Component) => (
  <Suspense fallback={pageFallback}>
    <Component />
  </Suspense>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestLayout />}>
        <Route index element={withSuspense(RoleRedirect)} />
        <Route path="/login" element={withSuspense(Login)} />
        <Route path="/signup" element={withSuspense(Signup)} />
        <Route path="/forgot-password" element={withSuspense(ForgotPassword)} />
        <Route path="/reset-password" element={withSuspense(ResetPassword)} />
        <Route path="/about" element={withSuspense(About)} />
        <Route path="/contact" element={withSuspense(Contact)} />
        <Route path="/faq" element={withSuspense(FAQ)} />
        <Route path="/privacy" element={withSuspense(Privacy)} />
        <Route path="/terms" element={withSuspense(Terms)} />
        <Route path="/500" element={withSuspense(ServerError)} />
      </Route>

      <Route element={<BuyerLayout />}>
        <Route path="/products" element={withSuspense(Products)} />
        <Route path="/products/:id" element={withSuspense(ProductDetails)} />
        <Route path="/search" element={withSuspense(SearchResults)} />
        <Route path="/cart" element={withSuspense(Cart)} />
        <Route path="/wishlist" element={withSuspense(Wishlist)} />
      </Route>

      <Route element={<RoleRoute allow={["buyer"]} />}>
        <Route element={<BuyerLayout />}>
          <Route path="/buyer/home" element={withSuspense(Home)} />
          <Route path="/checkout" element={withSuspense(Checkout)} />
          <Route path="/orders" element={withSuspense(BuyerOrders)} />
          <Route path="/orders/:id" element={withSuspense(OrderTracking)} />
          <Route path="/chat" element={withSuspense(BuyerChat)} />
          <Route path="/notifications" element={withSuspense(Notifications)} />
          <Route path="/profile" element={withSuspense(BuyerProfile)} />
          <Route path="/account/profile" element={withSuspense(SharedProfile)} />
          <Route path="/account/settings" element={withSuspense(SharedSettings)} />
        </Route>
      </Route>

      <Route element={<RoleRoute allow={["seller", "admin"]} />}>
        <Route path="/seller" element={<SellerLayout />}>
          <Route index element={<Navigate to="/seller/dashboard" replace />} />
          <Route path="dashboard" element={withSuspense(SellerDashboard)} />
          <Route path="products" element={withSuspense(MyProducts)} />
          <Route path="products/new" element={withSuspense(AddProduct)} />
          <Route path="products/:id/edit" element={withSuspense(EditProduct)} />
          <Route path="orders" element={withSuspense(SellerOrders)} />
          <Route path="analytics" element={withSuspense(SellerAnalytics)} />
          <Route path="chat" element={withSuspense(SellerChat)} />
          <Route path="profile" element={withSuspense(SellerProfile)} />
          <Route path="promotions" element={withSuspense(Promotions)} />
          <Route path="settings" element={withSuspense(SellerSettings)} />
        </Route>
      </Route>

      <Route element={<RoleRoute allow={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={withSuspense(AdminDashboard)} />
          <Route path="products" element={withSuspense(AdminProducts)} />
          <Route path="orders" element={withSuspense(AdminOrders)} />
          <Route path="users" element={withSuspense(AdminUsers)} />
          <Route path="sellers" element={withSuspense(AdminSellers)} />
          <Route path="analytics" element={withSuspense(AdminAnalytics)} />
          <Route path="reports" element={withSuspense(AdminReports)} />
          <Route path="moderation" element={withSuspense(AdminModeration)} />
          <Route path="settings" element={withSuspense(AdminSettings)} />
        </Route>
      </Route>

      <Route path="*" element={withSuspense(NotFound)} />
    </Routes>
  );
}
