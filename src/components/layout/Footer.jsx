import React from 'react';
import { Link } from 'react-router-dom';
import logoWordmark from '../../assets/logo-wordmark.svg';

const Footer = () => {
  return (
    <footer className="luxe-footer">
      <div className="footer-grid">
        {/* Column 1: Brand */}
        <div className="footer-brand">
          <img src={logoWordmark} alt="amaeti wordmark footer" className="footer-logo" style={{ filter: 'invert(1) brightness(100)' }} />
          <p className="footer-tagline">
            Wearable canvases built from organic symmetry and contemporary geometry.
          </p>
        </div>

        {/* Column 2: Newsletter */}
        <div className="footer-newsletter">
          <h3 className="newsletter-title">Join the Atelier</h3>
          <p className="newsletter-desc">Subscribe to receive exclusive access to private collection releases, exhibitions, and designer notes.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="YOUR EMAIL ADDRESS" className="newsletter-input" />
            <button type="submit" className="newsletter-submit">Subscribe</button>
          </form>
        </div>

        {/* Column 3: Navigation Links */}
        <div className="footer-links-col">
          <div className="footer-link-group">
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/about" className="footer-link">About</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div>© {new Date().getFullYear()} amaeti Studios. All Rights Reserved.</div>
        <div className="d-flex gap-4">
          <a href="#" className="footer-link" style={{ fontSize: '10px' }}>Privacy Policy</a>
          <a href="#" className="footer-link" style={{ fontSize: '10px' }}>Terms of Use</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
