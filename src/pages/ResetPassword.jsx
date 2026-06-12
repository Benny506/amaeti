import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';
import AuthCarousel from '../components/auth/AuthCarousel';
import { invokeEdgeFunction } from '../supabase';
import { addToast, showBlockingLoader, hideBlockingLoader } from '../store/uiSlice';
import '../styles/Auth.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      dispatch(addToast({ type: 'warning', message: 'Please fill in all fields.' }));
      return;
    }

    if (password !== confirmPassword) {
      dispatch(addToast({ type: 'error', message: 'Passwords do not match.' }));
      return;
    }

    if (password.length < 6) {
      dispatch(addToast({ type: 'warning', message: 'Password must be at least 6 characters.' }));
      return;
    }

    dispatch(showBlockingLoader('Resetting password...'));

    try {
      const { data, error } = await invokeEdgeFunction('reset-password', {
        email,
        password
      });

      if (error) {
        throw new Error(error);
      }

      dispatch(addToast({ type: 'success', message: 'Password reset successfully! Please sign in.' }));
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Reset password error:', err);
      dispatch(addToast({ type: 'error', message: err.message || 'Failed to reset password. Please try again.' }));
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
            <h1 className="auth-title">New Password</h1>
            <p className="auth-subtitle">Create a new secure password for your account.</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password" 
                    className="auth-input pe-5"
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

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    id="confirmPassword" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password" 
                    className="auth-input pe-5"
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-submit-btn">Reset Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
