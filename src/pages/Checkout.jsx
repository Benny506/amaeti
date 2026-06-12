import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { showBlockingLoader, hideBlockingLoader, addToast } from '../store/uiSlice';
import { syncCartWithDB, updateCartItemQuantity, removeCartItem } from '../store/cartSlice';
import { Trash2, Minus, Plus } from 'lucide-react';
import '../styles/Checkout.css';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector(state => state.cart);
  
  const [regions, setRegions] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    country: 'Nigeria'
  });

  // Fetch fresh cart and set email
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setFormData(prev => ({ ...prev, email: prev.email || user.email }));
      }
    };
    fetchUser();
    dispatch(syncCartWithDB());
  }, [dispatch]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/products');
    }
  }, [items, navigate]);

  // Fetch Delivery Regions
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const { data, error } = await supabase
          .from('delivery_regions')
          .select('*')
          .eq('is_active', true)
          .order('title', { ascending: true });
        
        if (error) throw error;
        setRegions(data || []);
      } catch (err) {
        console.error("Error fetching regions", err);
      }
    };
    fetchRegions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Math Logic
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalWeight = items.reduce((sum, item) => sum + ((item.weight || 0) * item.quantity), 0);

  const selectedRegionObj = useMemo(() => {
    return regions.find(r => r.id === selectedRegionId);
  }, [regions, selectedRegionId]);

  const shippingCost = useMemo(() => {
    if (!selectedRegionObj) return 0;
    
    let cost = parseFloat(selectedRegionObj.flat_fee) || 0;
    const threshold = parseFloat(selectedRegionObj.threshold) || 0;
    const extraCost = parseFloat(selectedRegionObj.extra_cost) || 0;
    
    if (threshold > 0 && totalWeight > threshold) {
      const extraUnits = Math.ceil((totalWeight - threshold) / threshold);
      cost += (extraUnits * extraCost);
    }
    return cost;
  }, [selectedRegionObj, totalWeight]);

  const grandTotal = subtotal + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form Validation
    const isFormValid = Object.values(formData).every(val => val.trim() !== '');
    if (!isFormValid) {
      dispatch(addToast({ type: 'error', message: 'Please fill out all contact and shipping details to continue.' }));
      return;
    }

    if (!selectedRegionId) {
      dispatch(addToast({ type: 'error', message: 'Please choose a delivery method to continue.' }));
      return;
    }
    
    dispatch(showBlockingLoader('Processing Order...'));
    try {
      // Setup payload
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to checkout.");

      const idempotencyKey = crypto.randomUUID();
      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        country: formData.country,
        state: formData.state,
        city: formData.city,
      };
      const contactInfo = {
        email: formData.email,
        phone: formData.phone,
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      const cartItemsPayload = items.map(item => ({
        variant_id: item.variant_id,
        product_id: item.product_id,
        quantity: item.quantity
      }));

      // 1. Create Order
      const { data: orderId, error: createError } = await supabase.rpc('create_order', {
        p_user_id: user.id,
        p_delivery_region_id: selectedRegionId,
        p_shipping_address: shippingAddress,
        p_contact_info: contactInfo,
        p_cart_items: cartItemsPayload,
        p_idempotency_key: idempotencyKey
      });

      if (createError) throw createError;

      // 2. Confirm Order
      const { error: confirmError } = await supabase.rpc('confirm_order', {
        p_order_id: orderId,
        p_payment_reference: `SIM-${Date.now()}`,
        p_gateway: 'simulation',
        p_amount_paid: grandTotal
      });

      if (confirmError) throw confirmError;

      // 3. Send Email to Admin (Simulated edge function call)
      await supabase.functions.invoke('send-email', {
        body: {
          action: 'order_created_admin',
          email: 'admin@amaeti.com', // or from config
          payload: {
            orderId: orderId,
            customerName: `${formData.firstName} ${formData.lastName}`,
            total: grandTotal
          }
        }
      });

      dispatch(syncCartWithDB());
      dispatch(addToast({ type: 'success', message: 'Order placed successfully!' }));
      navigate('/products'); // Redirect back to shop
    } catch (err) {
      console.error(err);
      dispatch(addToast({ type: 'error', message: err.message || 'An error occurred during checkout.' }));
    } finally {
      dispatch(hideBlockingLoader());
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="checkout-page">
      <div className="container">
        
        <div className="checkout-grid">
          
          {/* LEFT: Form & Delivery Selection */}
          <div>
            <form onSubmit={handleSubmit}>
              
              {/* Contact Info */}
              <div className="checkout-section">
                <h2 className="checkout-section-title">Contact Information</h2>
                <div className="row">
                  <div className="col-md-6 checkout-form-group">
                    <label className="checkout-label">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="checkout-input" />
                  </div>
                  <div className="col-md-6 checkout-form-group">
                    <label className="checkout-label">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="checkout-input" />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="checkout-section">
                <h2 className="checkout-section-title">Shipping Address</h2>
                <div className="row">
                  <div className="col-md-6 checkout-form-group">
                    <label className="checkout-label">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="checkout-input" />
                  </div>
                  <div className="col-md-6 checkout-form-group">
                    <label className="checkout-label">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="checkout-input" />
                  </div>
                  <div className="col-12 checkout-form-group">
                    <label className="checkout-label">Address (Street, Apt, Suite)</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="checkout-input" />
                  </div>
                  
                  {/* Datalist inputs */}
                  <div className="col-md-4 checkout-form-group">
                    <label className="checkout-label">Country</label>
                    <input list="countries" name="country" value={formData.country} onChange={handleInputChange} className="checkout-input" />
                    <datalist id="countries">
                      <option value="Nigeria" />
                      <option value="Ghana" />
                      <option value="Kenya" />
                      <option value="United Kingdom" />
                      <option value="United States" />
                    </datalist>
                  </div>
                  <div className="col-md-4 checkout-form-group">
                    <label className="checkout-label">State / Province</label>
                    <input list="states" name="state" value={formData.state} onChange={handleInputChange} className="checkout-input" />
                    <datalist id="states">
                      <option value="Lagos" />
                      <option value="Abuja" />
                      <option value="Rivers" />
                      <option value="Oyo" />
                      <option value="Kano" />
                    </datalist>
                  </div>
                  <div className="col-md-4 checkout-form-group">
                    <label className="checkout-label">City</label>
                    <input list="cities" name="city" value={formData.city} onChange={handleInputChange} className="checkout-input" />
                    <datalist id="cities">
                      <option value="Ikeja" />
                      <option value="Lekki" />
                      <option value="Victoria Island" />
                      <option value="Yaba" />
                      <option value="Surulere" />
                    </datalist>
                  </div>
                </div>
              </div>

              {/* Delivery Methods */}
              <div className="checkout-section">
                <h2 className="checkout-section-title">Delivery Method</h2>
                {regions.length === 0 ? (
                  <p className="text-muted" style={{ fontSize: '13px' }}>Loading delivery regions...</p>
                ) : (
                  <div className="delivery-radio-group">
                    {regions.map(region => {
                      const isActive = selectedRegionId === region.id;
                      // Math purely for display text on the radio card
                      let displayCost = parseFloat(region.flat_fee);
                      const t = parseFloat(region.threshold) || 0;
                      if (t > 0 && totalWeight > t) {
                        displayCost += (Math.ceil((totalWeight - t) / t) * (parseFloat(region.extra_cost) || 0));
                      }
                      
                      return (
                        <label key={region.id} className={`delivery-radio-label ${isActive ? 'active' : ''}`}>
                          <input 
                            type="radio" 
                            name="deliveryRegion" 
                            className="delivery-radio-input"
                            checked={isActive}
                            onChange={() => setSelectedRegionId(region.id)}
                          />
                          <div className="radio-custom"></div>
                          <div className="delivery-info">
                            <h4 className="delivery-title">
                              {region.title}
                              <span className="delivery-cost">₦{displayCost.toLocaleString('en-NG', {minimumFractionDigits: 2})}</span>
                            </h4>
                            {region.description && <p className="delivery-desc">{region.description}</p>}
                            {t > 0 && (
                              <p className="delivery-desc" style={{ marginTop: '4px', fontWeight: 500 }}>
                                +₦{parseFloat(region.extra_cost).toLocaleString('en-NG')} per extra {region.threshold}kg
                              </p>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mobile button (hidden on desktop, summary block stays visible) */}
              <div className="d-block d-lg-none mt-4">
                <button type="submit" className="checkout-btn">Pay Now</button>
              </div>

            </form>
          </div>

          {/* RIGHT: Order Summary */}
          <div>
            <div className="order-summary-card">
              <h3 className="summary-title">Order Summary</h3>
              
              <div className="cart-summary-items" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                {items.map((item, idx) => {
                  const hasAttributes = item.attributes && typeof item.attributes === 'object' && Object.keys(item.attributes).length > 0;
                  
                  return (
                    <div key={`${item.variant_id}-${idx}`} className="cart-summary-item" style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '15px', border: '1px solid rgba(255, 255, 255, 0.08)', gap: '15px', alignItems: 'flex-start' }}>
                      <img src={item.image} alt={item.title} className="cart-summary-img" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', alignSelf: 'flex-start' }} />
                      <div className="cart-summary-details">
                        <h4 className="cart-summary-name" style={{ marginBottom: hasAttributes ? '4px' : '8px', fontSize: '15px', lineHeight: '1.4' }}>
                          {item.title}
                          {typeof item.inventory_quantity === 'number' && item.inventory_quantity === 0 && (
                            <span className="badge bg-danger ms-2" style={{ fontSize: '10px' }}>Out of Stock</span>
                          )}
                          {typeof item.inventory_quantity === 'number' && item.inventory_quantity > 0 && item.inventory_quantity <= 3 && (
                            <span className="badge bg-warning text-dark ms-2" style={{ fontSize: '10px' }}>Low Stock</span>
                          )}
                        </h4>

                        {hasAttributes && (
                          <div className="cart-item-attributes" style={{ marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {Object.entries(item.attributes).map(([k, v]) => (
                              <span key={k} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: '4px', color: '#ccc' }}>
                                {k}: <strong style={{ color: '#fff' }}>{v}</strong>
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="cart-summary-meta" style={{ marginBottom: '8px' }}>Weight: {(item.weight || 0) * item.quantity}kg</p>
                        
                        <div className="cart-item-actions mt-2" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div className="quantity-selector" style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '4px', display: 'inline-flex', padding: '2px' }}>
                            <button
                              type="button"
                              onClick={() => dispatch(updateCartItemQuantity({ variant_id: item.variant_id, quantity: item.quantity - 1 }))}
                              disabled={item.quantity <= 1}
                              style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex' }}
                            >
                              <Minus size={14} color="#555" />
                            </button>
                            <span style={{ minWidth: '24px', textAlign: 'center', fontSize: '14px', alignSelf: 'center', color: '#121212' }}>{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => dispatch(updateCartItemQuantity({ variant_id: item.variant_id, quantity: item.quantity + 1 }))}
                              disabled={item.inventory_quantity !== null && item.quantity >= item.inventory_quantity}
                              style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex' }}
                            >
                              <Plus size={14} color="#555" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => dispatch(removeCartItem(item.variant_id))}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', color: '#dc3545' }}
                            title="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="cart-summary-meta" style={{ marginTop: '10px', fontWeight: 600, color: '#fff', fontSize: '14px' }}>
                          ₦{(item.price * item.quantity).toLocaleString('en-NG', {minimumFractionDigits: 2})}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="summary-item">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString('en-NG', {minimumFractionDigits: 2})}</span>
              </div>
              <div className="summary-item">
                <span>Total Weight</span>
                <span>{totalWeight}kg</span>
              </div>
              <div className="summary-item">
                <span>Shipping</span>
                <span>{selectedRegionId ? `₦${shippingCost.toLocaleString('en-NG', {minimumFractionDigits: 2})}` : 'Select a region'}</span>
              </div>
              
              <div className="summary-total">
                <span>Total</span>
                <span>₦{grandTotal.toLocaleString('en-NG', {minimumFractionDigits: 2})}</span>
              </div>

              {/* Desktop button */}
              <button 
                className="checkout-btn d-none d-lg-block" 
                onClick={handleSubmit}
              >
                Pay Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
