import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AnnouncementBar from './components/layout/AnnouncementBar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Categories from './pages/Categories';
import Products from './pages/Products';
import SingleProduct from './pages/SingleProduct';
import Checkout from './pages/Checkout';

import BlockingLoader from './components/ui/BlockingLoader';
import SubtleLoader from './components/ui/SubtleLoader';
import ToastContainer from './components/ui/ToastContainer';
import CartDrawer from './components/cart/CartDrawer';
import AutoLogin from './components/auth/AutoLogin';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';

import DashboardLayout from './components/layout/DashboardLayout';
import Profile from './pages/dashboard/Profile';
import Security from './pages/dashboard/Security';
import Orders from './pages/dashboard/Orders';
import OrderDetails from './pages/dashboard/OrderDetails';
import { ConfirmProvider } from './components/ui/ConfirmProvider';

function App() {
  return (
    <Router>
      <ConfirmProvider>
        <BlockingLoader />
        <SubtleLoader />
        <ToastContainer />
        <ScrollToTop />
        <AutoLogin>
        <CartDrawer />
        
        <Routes>
          {/* Dashboard Routes (No Header/Footer) */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="security" element={<Security />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetails />} />
          </Route>

          {/* Storefront Routes */}
          <Route path="/*" element={
            <div className="app-wrapper">
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<SingleProduct />} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-use" element={<TermsOfUse />} />
              </Routes>
              <Footer />
            </div>
          } />
        </Routes>
        </AutoLogin>
      </ConfirmProvider>
    </Router>
  );
}

export default App;