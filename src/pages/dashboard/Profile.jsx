import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useDispatch, useSelector } from 'react-redux';
import { addToast, showBlockingLoader, hideBlockingLoader } from '../../store/uiSlice';
import { setAuthData } from '../../store/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, profile } = useSelector(state => state.auth);
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
    if (profile) {
      setUsername(profile.username || '');
    }
  }, [user, profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    dispatch(showBlockingLoader('Saving Profile...'));
    try {
      if (!user) throw new Error("Not logged in");

      const { error } = await supabase
        .from('user_profiles')
        .update({ username })
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Update local Redux state so header and other places reflect the change immediately
      dispatch(setAuthData({ user, profile: { ...profile, username } }));
      
      dispatch(addToast({ type: 'success', message: 'Profile updated successfully!' }));
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message || 'Failed to update profile.' }));
    } finally {
      dispatch(hideBlockingLoader());
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2 className="dashboard-card-title">My Profile</h2>
        
        <form onSubmit={handleSave}>
          <div className="dashboard-form-group">
            <label className="dashboard-label">Email Address (Read Only)</label>
            <input 
              type="email" 
              className="dashboard-input" 
              value={email} 
              disabled 
            />
          </div>

          <div className="dashboard-form-group">
            <label className="dashboard-label">Username</label>
            <input 
              type="text" 
              className="dashboard-input" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="e.g. Amaeti Fan"
              required
            />
          </div>

          <button type="submit" className="dashboard-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
