import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showSubtleLoader, hideSubtleLoader, addToast } from '../../store/uiSlice';
import { supabase } from '../../supabase';
import logoWordmark from '../../assets/logo-wordmark.svg';

const Footer = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    dispatch(showSubtleLoader('Joining waitlist...'));

    const { error } = await supabase.from('email_waitlist').insert([{ email }]);

    dispatch(hideSubtleLoader());

    if (error) {
      if (error.code === '23505') {
        dispatch(addToast({ type: 'info', message: 'You are already on the Atelier waitlist!' }));
      } else {
        dispatch(addToast({ type: 'error', message: 'An error occurred. Please try again.' }));
        console.error('Waitlist Error:', error);
      }
    } else {
      dispatch(addToast({ type: 'success', message: 'Welcome to the Atelier. You have been added to the waitlist.' }));
      setEmail('');
    }
  };

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
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="YOUR EMAIL ADDRESS" 
              className="newsletter-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
          <Link to="/privacy-policy" className="footer-link" style={{ fontSize: '10px' }}>Privacy Policy</Link>
          <Link to="/terms-of-use" className="footer-link" style={{ fontSize: '10px' }}>Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
