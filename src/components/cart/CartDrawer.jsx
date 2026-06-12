import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { toggleCart, removeCartItem, updateCartItemQuantity, selectCartTotal, selectCartItemCount } from '../../store/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/CartDrawer.css';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, isOpen } = useSelector((state) => state.cart);
  const cartTotal = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartItemCount);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCheckoutClick = () => {
    dispatch(toggleCart());
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => dispatch(toggleCart())}></div>
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart ({itemCount})</h2>
          <button className="close-btn" onClick={() => dispatch(toggleCart())}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={48} strokeWidth={1} />
              <p>Your cart is empty.</p>
              <button className="continue-shopping" onClick={() => dispatch(toggleCart())}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.variant_id} className="cart-item">
                  <div className="cart-item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.title} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>
                  <div className="cart-item-details">
                    <div className="cart-item-header">
                      <Link
                        to={`/products/${item.slug}`}
                        className="cart-item-title"
                        onClick={() => dispatch(toggleCart())}
                      >
                        {item.title}
                      </Link>
                      <button
                        className="remove-btn"
                        onClick={() => dispatch(removeCartItem(item.variant_id))}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="cart-item-price">₦{item.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>

                    <div className="cart-item-actions">
                      <div className="quantity-selector">
                        <button
                          onClick={() => dispatch(updateCartItemQuantity({ variant_id: item.variant_id, quantity: item.quantity - 1 }))}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => dispatch(updateCartItemQuantity({ variant_id: item.variant_id, quantity: item.quantity + 1 }))}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Subtotal</span>
              <span>₦{cartTotal.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <p className="taxes-note">Taxes and shipping calculated at checkout</p>
            <button className="checkout-btn" onClick={handleCheckoutClick}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;