import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';
import AuthCarousel from '../components/auth/AuthCarousel';
import { addToast, showBlockingLoader, hideBlockingLoader } from '../store/uiSlice';
import { supabase } from '../supabase';
import '../styles/Auth.css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      dispatch(addToast({ type: 'warning', message: 'Please fill in all fields.' }));
      return;
    }

    dispatch(showBlockingLoader());

    try {
      const { data: userId, error } = await supabase.rpc('get_user_id_by_email', {
        email_address: formData.email.toLowerCase().trim()
      });

      if (error) throw error;

      if (userId) {
        dispatch(addToast({ type: 'error', message: 'An account with this email already exists.' }));
      } else {
        // Valid new user, proceed to OTP verification
        navigate('/verify-otp', { state: { ...formData } });
      }
    } catch (err) {
      console.error('Registration check failed:', err);
      dispatch(addToast({ type: 'error', message: 'Failed to verify account. Please try again.' }));
    } finally {
      dispatch(hideBlockingLoader());
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <AuthCarousel />
        
        <div className="auth-form-side">
          <div className="auth-form-wrapper">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join us to curate your bespoke collection and enjoy exclusive privileges.</p>

            <form className="auth-form" onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="username">Full Name</label>
                <input 
                  type="text" 
                  id="username" 
                  placeholder="John Doe" 
                  className="auth-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="you@example.com" 
                  className="auth-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    placeholder="Create a secure password" 
                    className="auth-input pe-5"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-submit-btn">Register</button>
            </form>

            <div className="auth-footer">
              <p>Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
