import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase';
import { useDispatch, useSelector } from 'react-redux';
import { showSubtleLoader, hideSubtleLoader } from '../../store/uiSlice';
import { setOrders } from '../../store/ordersSlice';

const Orders = () => {
  const dispatch = useDispatch();
  const { items: orders } = useSelector(state => state.orders);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Show subtle loader only if orders are completely empty initially
        if (orders.length === 0) {
          dispatch(showSubtleLoader('Loading orders...'));
        }

        const { data, error } = await supabase
          .from('orders')
          .select('id, order_code, created_at, status, total_amount')
          .eq('user_id', user.id)
          .neq('status', 'pending_payment')
          .order('created_at', { ascending: false });

        if (!error && data) {
          dispatch(setOrders(data));
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        dispatch(hideSubtleLoader());
      }
    };
    fetchOrders();
    // Intentionally omit 'orders' from dependency array to avoid infinite refetch loop
  }, [dispatch]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2 className="dashboard-card-title">My Orders</h2>

        {orders.length === 0 ? (
          <p className="text-muted">You have no orders yet.</p>
        ) : (
          <div>
            {orders.map(order => (
              <div key={order.id} className="order-list-card">
                <div className="order-header">
                  <div>
                    <div className="order-id">Order #{order.order_code}</div>
                    <div className="order-date">{new Date(order.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                  <span className={`order-status-badge status-${order.status}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="order-footer">
                  <div className="order-total">
                    ₦{parseFloat(order.total_amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </div>
                  <Link to={`/dashboard/orders/${order.id}`} className="order-view-btn">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
