import { supabase } from '../supabase';
import { setAuthData, clearAuthData, setInitialized } from '../store/authSlice';
import { syncCartWithDB } from '../store/cartSlice';

export const runAuthBootstrap = () => async (dispatch) => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      dispatch(clearAuthData());
      dispatch(setInitialized(true));
      return false;
    }

    const user = session.user;

    // Critical Call: Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Critical bootstrapper error: Failed to fetch profile', profileError);
      // Auto logout
      await supabase.auth.signOut();
      dispatch(clearAuthData());
      dispatch(setInitialized(true));
      return false;
    }

    // Success: Update Redux auth state
    dispatch(setAuthData({ user, profile }));

    // Non-Critical Call: Sync cart
    try {
      await dispatch(syncCartWithDB()).unwrap();
    } catch (cartError) {
      console.error('Non-critical bootstrapper error: Cart sync failed', cartError);
      // We don't fail the login process just because cart sync fails
    }

    dispatch(setInitialized(true));
    return true;
  } catch (error) {
    console.error('Bootstrapper unexpected error:', error);
    dispatch(clearAuthData());
    dispatch(setInitialized(true));
    return false;
  }
};
