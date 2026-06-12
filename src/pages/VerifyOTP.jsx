import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AuthCarousel from '../components/auth/AuthCarousel';
import { addToast, showBlockingLoader, hideBlockingLoader } from '../store/uiSlice';
import { supabase, invokeEdgeFunction } from '../supabase';
import '../styles/Auth.css';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const hasSentRef = useRef(false);
  
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const userData = location.state;

  useEffect(() => {
    let interval;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled, timer]);

  useEffect(() => {
    if (!userData || !userData.email) {
      navigate('/register');
      return;
    }
    
    if (!hasSentRef.current) {
      hasSentRef.current = true;
      handleSendOTP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendOTP = async () => {
    dispatch(showBlockingLoader('Sending secure code...'));
    try {
      const { data: code, error: rpcError } = await supabase.rpc('generate_and_upsert_otp', {
        email_address: userData.email
      });
      
      if (rpcError) throw rpcError;

      const { error: mailError } = await invokeEdgeFunction('send-email', {
        action: 'send_otp',
        email: userData.email,
        payload: { code }
      });
      
      if (mailError) throw mailError;

      dispatch(addToast({ type: 'success', message: 'Verification code sent to your email.' }));
      setTimer(60);
      setIsResendDisabled(true);
    } catch (err) {
      console.error('Failed to send OTP:', err);
      dispatch(addToast({ type: 'error', message: 'Failed to send verification code. Please try again.' }));
    } finally {
      dispatch(hideBlockingLoader());
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const enteredCode = otp.join('');
    
    if (enteredCode.length < 6) {
      dispatch(addToast({ type: 'warning', message: 'Please enter the full 6-digit code.' }));
      return;
    }

    dispatch(showBlockingLoader('Verifying code...'));
    try {
      const { data: isValid, error } = await supabase.rpc('verify_otp', {
        email_address: userData.email,
        otp_code: enteredCode
      });
      
      if (error) throw error;

      if (isValid) {
        if (userData.context === 'reset_password') {
          dispatch(addToast({ type: 'success', message: 'Email verified! Proceed to reset password.' }));
          navigate('/reset-password', { state: { email: userData.email } });
        } else {
          dispatch(addToast({ type: 'success', message: 'Email verified! Creating your account...' }));
          
          // Call the edge function to create the user and profile
          const { error: createError } = await invokeEdgeFunction('create-user', {
            email: userData.email,
            password: userData.password,
            name: userData.name
          });

          if (createError) {
            throw new Error(createError);
          }

          dispatch(addToast({ type: 'success', message: 'Account created successfully! Please sign in.' }));
          navigate('/login', { replace: true });
        }
      } else {
        dispatch(addToast({ type: 'error', message: 'Invalid or expired verification code.' }));
      }
    } catch (err) {
      console.error('Verification error:', err);
      dispatch(addToast({ type: 'error', message: err.message || 'Verification failed. Please try again.' }));
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
            <h1 className="auth-title">Verify Email</h1>
            <p className="auth-subtitle">
              We have sent a 6-digit secure code to <strong>{userData?.email}</strong>. Please enter it below.
            </p>

            <form className="auth-form" onSubmit={handleVerify}>
              <div className="form-group">
                <label>Verification Code</label>
                <div className="otp-input-container">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      ref={(el) => (inputRefs.current[index] = el)}
                      className="auth-input otp-input"
                    />
                  ))}
                </div>
              </div>

              <button type="submit" className="auth-submit-btn">Verify Code</button>
            </form>

            <div className="auth-footer">
              <p>
                Didn't receive the code?{' '}
                <button 
                  type="button" 
                  onClick={handleSendOTP} 
                  disabled={isResendDisabled}
                  className="auth-link-btn" 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: isResendDisabled ? 'not-allowed' : 'pointer',
                    color: isResendDisabled ? '#999' : '#000'
                  }}
                >
                  {isResendDisabled ? `Resend Code (${timer}s)` : 'Resend Code'}
                </button>
              </p>
              <p className="mt-3"><Link to="/login" className="auth-link">Back to Sign In</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
