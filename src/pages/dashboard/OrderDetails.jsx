import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { useDispatch } from 'react-redux';
import { showSubtleLoader, hideSubtleLoader } from '../../store/uiSlice';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      dispatch(showSubtleLoader('Loading order details...'));
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch Order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select(`*, delivery_regions(title)`)
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (orderError) throw orderError;
        setOrder(orderData);

        // Fetch Order Items
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', id);

        if (itemsError) throw itemsError;
        setItems(itemsData || []);
      } catch (err) {
        console.error("Error fetching order details:", err);
      } finally {
        dispatch(hideSubtleLoader());
      }
    };
    fetchOrderDetails();
  }, [id, dispatch]);

  if (!order) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card text-center">
          <h3>Order Not Found</h3>
          <p className="text-muted">This order may not exist or you do not have permission to view it.</p>
          <Link to="/dashboard/orders" className="dashboard-btn" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '15px' }}>
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      <button onClick={() => navigate('/dashboard/orders')} className="dashboard-btn" style={{ background: 'transparent', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', marginBottom: '20px', padding: '8px 15px' }}>
        &larr; Back to Orders
      </button>

      <div className="dashboard-card">
        <div className="order-detail-header">
          <h2 className="dashboard-card-title" style={{ border: 'none', padding: 0, margin: 0 }}>
            Order #{order.order_code}
          </h2>
          <div className="order-detail-meta">
            <span>{new Date(order.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            <span className={`order-status-badge status-${order.status}`}>{order.status.replace('_', ' ')}</span>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="order-detail-section">
              <h4>Shipping Information</h4>
              <p><strong>Name:</strong> {order.contact_info.firstName} {order.contact_info.lastName}</p>
              <p><strong>Email:</strong> {order.contact_info.email}</p>
              <p><strong>Phone:</strong> {order.contact_info.phone}</p>
              <p><strong>Address:</strong> {order.shipping_address.address}, {order.shipping_address.city}, {order.shipping_address.state}, {order.shipping_address.country}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="order-detail-section">
              <h4>Order Summary</h4>
              <p><strong>Subtotal:</strong> ₦{parseFloat(order.subtotal_amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
              <p>
                <strong>Shipping:</strong> ₦{parseFloat(order.shipping_fee).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                {order.delivery_regions && ` (${order.delivery_regions.title})`}
              </p>
              <hr style={{ margin: '10px 0', borderColor: '#eaeaea' }} />
              <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-bg-dark)' }}>
                <strong>Total:</strong> ₦{parseFloat(order.total_amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {order.tracking_link && (
          <div className="order-detail-section" style={{ background: '#eef8ff', borderColor: '#b8daff' }}>
            <h4>Tracking Information</h4>
            <p><strong>Tracking ID:</strong> {order.tracking_id || 'N/A'}</p>
            {order.tracking_notes && <p><strong>Notes:</strong> {order.tracking_notes}</p>}
            <a href={order.tracking_link} target="_blank" rel="noopener noreferrer" className="dashboard-btn" style={{ display: 'inline-block', marginTop: '10px', textDecoration: 'none' }}>
              Track Package
            </a>
          </div>
        )}

        <div className="order-detail-section" style={{ background: '#fff' }}>
          <h4>Items Ordered</h4>
          <div>
            {items.map(item => {
              // Parse the snapshot
              const product = item.product_snapshot || {};
              const variant = item.variant_snapshot || {};
              // Attempt to find image
              let imgUrl = null;
              if (variant.product_media && Array.isArray(variant.product_media)) {
                imgUrl = variant.product_media.find(m => m.media_type === 'image')?.media_url;
              }

              // Extract variant specs safely
              const sku = variant.sku || 'N/A';
              const attributes = variant.attributes || {}; // e.g. {"Size": "L", "Color": "Red"}
              const features = Array.isArray(variant.features) ? variant.features : [];

              return (
                <div key={item.id} className="order-item-row" style={{ alignItems: 'flex-start' }}>
                  {imgUrl ? (
                    <img src={imgUrl} alt={item.title_at_purchase} className="order-item-img" />
                  ) : (
                    <div className="order-item-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '10px' }}>No Image</div>
                  )}
                  <div className="order-item-info">
                    <div className="order-item-title">{item.title_at_purchase}</div>

                    {/* Variant Specifics */}
                    <div className="order-item-meta" style={{ marginBottom: '6px' }}>
                      <strong>SKU:</strong> {sku}
                    </div>

                    {Object.keys(attributes).length > 0 && (
                      <div className="order-item-meta" style={{ marginBottom: '6px' }}>
                        {Object.entries(attributes).map(([k, v]) => (
                          <span key={k} style={{ marginRight: '10px', background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>
                            {k}: <strong>{v}</strong>
                          </span>
                        ))}
                      </div>
                    )}

                    {features.length > 0 && (
                      <div className="order-item-meta" style={{ marginBottom: '8px' }}>
                        <ul style={{ paddingLeft: '15px', margin: 0, color: '#777' }}>
                          {features.map((feat, i) => <li key={i}>{feat}</li>)}
                        </ul>
                      </div>
                    )}

                    <div className="order-item-meta">Qty: {item.quantity} | Weight: {item.weight_at_purchase * item.quantity}kg</div>
                    <div style={{ marginTop: '5px', fontWeight: 500, color: 'var(--color-bg-dark)' }}>
                      ₦{(parseFloat(item.price_at_purchase) * item.quantity).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  {/* Clickable link to product using the preserved product_id */}
                  {item.product_id && (
                    <div style={{ alignSelf: 'center' }}>
                      <Link to={`/products/${item.product_id}`} style={{ textDecoration: 'none', color: 'var(--color-primary)', fontSize: '13px', fontWeight: 500 }}>
                        Buy it again
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
