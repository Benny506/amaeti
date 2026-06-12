import React, { useState } from 'react';
import { supabase } from '../../supabase';
import { useDispatch } from 'react-redux';
import { addToast, showBlockingLoader, hideBlockingLoader } from '../../store/uiSlice';
import { useConfirm } from '../../components/ui/ConfirmProvider';
import { Eye, EyeOff } from 'lucide-react';

const Security = () => {
  const dispatch = useDispatch();
  const { confirm } = useConfirm();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      dispatch(addToast({ type: 'error', message: 'Passwords do not match.' }));
      return;
    }

    if (password.length < 6) {
      dispatch(addToast({ type: 'error', message: 'Password must be at least 6 characters long.' }));
      return;
    }

    const isConfirmed = await confirm({
      title: 'Update Password',
      description: 'Are you sure you want to update your password? You will need to use the new password on your next login.',
      confirmText: 'Yes, update',
      cancelText: 'Cancel',
      iconType: 'warning'
    });

    if (!isConfirmed) return;

    dispatch(showBlockingLoader('Updating password...'));
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      dispatch(addToast({ type: 'success', message: 'Password updated successfully!' }));
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message || 'Failed to update password.' }));
    } finally {
      dispatch(hideBlockingLoader());
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2 className="dashboard-card-title">Security Settings</h2>
        
        <form onSubmit={handleUpdatePassword}>
          <div className="dashboard-form-group">
            <label className="dashboard-label">New Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                className="dashboard-input" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="dashboard-form-group">
            <label className="dashboard-label">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                className="dashboard-input" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="dashboard-btn">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Security;
