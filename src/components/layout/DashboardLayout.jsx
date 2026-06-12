import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import '../../styles/Dashboard.css';

const DashboardLayout = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <DashboardSidebar 
        isMobileNavOpen={isMobileNavOpen} 
        closeNav={() => setIsMobileNavOpen(false)} 
      />
      
      <div className="dashboard-main">
        {/* Mobile TopBar just for the hamburger menu since there's no main navbar */}
        <div className="dashboard-topbar d-lg-none">
          <button className="dashboard-menu-btn" onClick={() => setIsMobileNavOpen(true)}>
            ☰
          </button>
          <h1 style={{ marginLeft: '15px', fontSize: '18px', margin: 0, fontFamily: 'var(--font-heading)' }}>
            Amaeti
          </h1>
        </div>
        
        <div className="dashboard-content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
