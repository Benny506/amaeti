import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { supabase } from '../../supabase';
import { clearCart, toggleCart } from '../../store/cartSlice';
import { clearAuthData } from '../../store/authSlice';
import { setOrders } from '../../store/ordersSlice';

import { useConfirm } from '../ui/ConfirmProvider';

import logoMonogram from '../../assets/logo.svg';
import logoWordmark from '../../assets/logo-wordmark.svg';

const DashboardSidebar = ({ isMobileNavOpen, closeNav }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { confirm } = useConfirm();

  const handleLogout = async () => {
    const isConfirmed = await confirm({
      title: 'Sign Out',
      description: 'Are you sure you want to sign out of your account?',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
      iconType: 'warning'
    });

    if (isConfirmed) {
      await supabase.auth.signOut();
      dispatch(clearCart());
      dispatch(clearAuthData());
      dispatch(setOrders([]));
      navigate('/products');
    }
  };

  return (
    <div className={`dashboard-sidebar ${isMobileNavOpen ? 'open' : ''}`}>
      <div className="dashboard-sidebar-header" style={{ padding: '20px 20px 10px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="mobile-brand">
          <img src={logoMonogram} alt="amaeti icon" style={{ height: '35px' }} />
          <img src={logoWordmark} alt="amaeti wordmark" style={{ height: '24px', marginLeft: '10px' }} />
        </div>
        <button className="dashboard-sidebar-close" onClick={closeNav}>&times;</button>
      </div>

      <div className="dashboard-sidebar-nav">

        <div className="dashboard-nav-group">
          <div className="dashboard-nav-title">Account</div>
          <NavLink to="/dashboard/profile" className={({ isActive }) => isActive ? 'dashboard-nav-link active' : 'dashboard-nav-link'} onClick={closeNav}>
            <i>👤</i> Profile
          </NavLink>
          <NavLink to="/dashboard/security" className={({ isActive }) => isActive ? 'dashboard-nav-link active' : 'dashboard-nav-link'} onClick={closeNav}>
            <i>🔒</i> Security
          </NavLink>
        </div>

        <div className="dashboard-nav-group">
          <div className="dashboard-nav-title">Shop</div>
          <NavLink to="/dashboard/orders" className={({ isActive }) => isActive ? 'dashboard-nav-link active' : 'dashboard-nav-link'} onClick={closeNav}>
            <i>📦</i> Orders
          </NavLink>
        </div>

        <div className="dashboard-nav-group">
          <div className="dashboard-nav-title">Quick Links</div>
          <NavLink to="/" className="dashboard-nav-link" onClick={closeNav}>
            <i>🏠</i> Landing Page
          </NavLink>
          <NavLink to="/products" className="dashboard-nav-link" onClick={closeNav}>
            <i>🛍️</i> Back to Shopping
          </NavLink>
          <button className="dashboard-nav-link" onClick={() => { closeNav(); dispatch(toggleCart()); }}>
            <i>🛒</i> My Cart
          </button>
        </div>

      </div>

      <div style={{ padding: '20px' }}>
        <button className="dashboard-btn" style={{ width: '100%', backgroundColor: '#dc3545' }} onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
