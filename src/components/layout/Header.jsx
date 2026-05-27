import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoWordmark from '../../assets/logo-wordmark.svg';
import logoMonogram from '../../assets/logo.svg';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.location.pathname === '/' ? window.innerHeight * 0.95 : 50;
      setIsScrolled(window.scrollY > threshold);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !isScrolled;

  const headerStyle = isHome ? {
    position: 'fixed',
    top: isScrolled ? '0' : '35px', 
    width: '100%',
    background: isScrolled ? 'rgba(250, 249, 246, 0.85)' : 'transparent',
    backdropFilter: isScrolled ? 'blur(15px)' : 'none',
    WebkitBackdropFilter: isScrolled ? 'blur(15px)' : 'none',
    borderBottom: isScrolled ? '1px solid rgba(212, 197, 177, 0.3)' : '1px solid transparent'
  } : {
    position: 'sticky',
    top: '0',
    background: 'rgba(250, 249, 246, 0.85)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    borderBottom: '1px solid rgba(212, 197, 177, 0.3)'
  };

  return (
    <>
      <header className={`luxe-nav ${isScrolled ? 'scrolled' : ''} ${isTransparent ? 'transparent-mode' : ''}`} style={headerStyle}>
        <div className="nav-container">
          <button className="burger-menu-btn" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} color={isTransparent ? '#ffffff' : 'var(--color-text-dark)'} />
          </button>

          <nav className="nav-links">
            <Link to="/" className={`nav-link-item ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            <Link to="/about" className={`nav-link-item ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
            <Link to="/contact" className={`nav-link-item ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
          </nav>

          <Link to="/" className="d-flex align-items-center justify-content-center">
            <img
              src={logoWordmark}
              alt="amaeti wordmark"
              className="nav-brand-img"
              style={{
                height: '42px',
                filter: isScrolled ? 'drop-shadow(0 2px 5px rgba(0,0,0,0.05))' : 'none'
              }}
            />
          </Link>

          <div className="nav-actions">
            <span className="coming-soon-badge" style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              borderBottom: '1px solid var(--color-primary)',
              paddingBottom: '2px',
              transition: 'all 0.3s'
            }}>Coming Soon</span>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: 'rgba(26,26,26,0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 2000,
          padding: '40px 30px',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUpFade 0.4s ease-out'
        }}>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div className="d-flex align-items-center gap-0" style={{ gap: '0px' }}>
              <img src={logoMonogram} alt="amaeti icon" style={{ height: '45px', filter: 'invert(1) brightness(100)' }} />
              <img src={logoWordmark} alt="amaeti wordmark" style={{ height: '30px', filter: 'invert(1) brightness(100)' }} />
            </div>
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: '#fff' }}>
              <X size={28} />
            </button>
          </div>
          <div className="d-flex flex-column gap-4" style={{ marginTop: '40px' }}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', fontSize: '24px', fontFamily: 'var(--font-serif-display)', textDecoration: 'none', letterSpacing: '0.1em' }}>Home</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', fontSize: '24px', fontFamily: 'var(--font-serif-display)', textDecoration: 'none', letterSpacing: '0.1em' }}>About</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', fontSize: '24px', fontFamily: 'var(--font-serif-display)', textDecoration: 'none', letterSpacing: '0.1em' }}>Contact</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
