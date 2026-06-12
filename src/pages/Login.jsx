import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';
import AuthCarousel from '../components/auth/AuthCarousel';
import { supabase } from '../supabase';
import { addToast, showBlockingLoader, hideBlockingLoader } from '../store/uiSlice';
import { runAuthBootstrap } from '../utils/authBootstrapper';
import '../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      dispatch(addToast({ type: 'warning', message: 'Please enter both email and password.' }));
      return;
    }

    dispatch(showBlockingLoader('Signing in...'));

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Sync Redux auth state
      const isSuccess = await dispatch(runAuthBootstrap());

      if (!isSuccess) {
        throw new Error('Authentication failed. Unable to fetch user profile.');
      }

      dispatch(addToast({ type: 'success', message: 'Welcome back!' }));
      navigate('/products', { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      dispatch(addToast({ type: 'error', message: err.message || 'Invalid login credentials.' }));
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
            <h1 className="auth-title">Log In</h1>
            <p className="auth-subtitle">Enter your email and password to access your account.</p>

            <form className="auth-form" onSubmit={handleLogin}>
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

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password" 
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

              <div className="form-actions d-flex justify-content-end align-items-center mb-4">
                <Link to="/forgot-password" className="forgot-password-link">Forgot password?</Link>
              </div>

              <button type="submit" className="auth-submit-btn">Sign In</button>
            </form>

            <div className="auth-footer">
              <p>Don't have an account? <Link to="/register" className="auth-link">Create an account</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
