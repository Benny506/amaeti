import React from 'react';
import { useLocation } from 'react-router-dom';

const AnnouncementBar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div 
      className="announcement-bar"
      style={{
        position: isHome ? 'absolute' : 'relative',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1051,
        background: isHome ? 'rgba(26,26,26,0.35)' : 'var(--color-text-dark)',
        backdropFilter: isHome ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: isHome ? 'blur(8px)' : 'none',
        color: 'var(--color-bg-light)'
      }}
    >
      DISCOVER AMAETI STUDIOS • SCULPTURAL SILHOUETTES • FREE WORLDWIDE DELIVERY ON ORDERS OVER $300
    </div>
  );
};

export default AnnouncementBar;
