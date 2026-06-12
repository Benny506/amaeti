import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AuthCarousel from '../components/auth/AuthCarousel';
import { supabase } from '../supabase';
import { addToast, showBlockingLoader, hideBlockingLoader } from '../store/uiSlice';
import '../styles/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      dispatch(addToast({ type: 'warning', message: 'Please enter your email address.' }));
      return;
    }

    dispatch(showBlockingLoader());

    try {
      const { data: userId, error } = await supabase.rpc('get_user_id_by_email', {
        email_address: email.toLowerCase().trim()
      });

      if (error) throw error;

      if (userId) {
        // User exists, navigate to Verify OTP screen with a reset context
        navigate('/verify-otp', { state: { email: email.toLowerCase().trim(), context: 'reset_password' } });
      } else {
        dispatch(addToast({ type: 'error', message: 'No account found with this email address.' }));
      }
    } catch (err) {
      console.error('Password reset check failed:', err);
      dispatch(addToast({ type: 'error', message: 'Failed to verify email. Please try again.' }));
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
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">Enter the email address associated with your account, and we will send you a secure OTP to reset your password.</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" 
                  className="auth-input"
                />
              </div>

              <button type="submit" className="auth-submit-btn">Send Reset Code</button>
            </form>

            <div className="auth-footer">
              <p>Remember your password? <Link to="/login" className="auth-link">Sign in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
