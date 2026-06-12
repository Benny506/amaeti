import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingCart } from 'lucide-react';
import { addCartItemAsync } from '../../store/cartSlice';
import { addToast } from '../../store/uiSlice';
import { resolveImageUrl } from '../../supabase';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);

  // Default to the designated default variant or the first one
  const defaultVariant = product.product_variants?.find(v => v.is_default) || product.product_variants?.[0];

  // Try to find the image for the default variant, fallback to any product media
  const media = defaultVariant?.product_media?.find(m => m.media_type === 'image')
    || product.product_variants?.[0]?.product_media?.find(m => m.media_type === 'image');

  const imageUrl = media ? resolveImageUrl(media.media_url) : 'https://via.placeholder.com/300x400?text=No+Image';

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigating to product detail page
    e.stopPropagation();

    if (!defaultVariant) return;

    setIsAdding(true);

    try {
      await dispatch(addCartItemAsync({
        product_id: product.id,
        variant_id: defaultVariant.id,
        quantity: 1,
        price: defaultVariant.price,
        title: product.title,
        slug: product.slug,
        image: imageUrl,
        weight: defaultVariant.weight || 1.0,
        attributes: defaultVariant.attributes || null
      })).unwrap();

      dispatch(addToast({
        type: 'success',
        message: 'Added to cart'
      }));
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        message: 'Failed to add item'
      }));
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="product-card group">
      <div className="uniform-img-wrapper">
        <Link to={`/products/${product.id}`} className="d-block w-100 h-100">
          <img
            src={imageUrl}
            alt={product.title}
            className="uniform-img"
            loading="lazy"
          />
          {/* Subtle gradient overlay to ensure button visibility */}
          <div className="img-overlay-gradient"></div>
        </Link>

        {/* Add to Cart CTA - Subtle Corner Button */}
        {defaultVariant && (
          <button
            className="action-add-btn-corner"
            onClick={handleAddToCart}
            title="Quick Add"
          >
            <ShoppingCart size={14} style={{ marginRight: '6px' }} />
            <span>Add</span>
          </button>
        )}
      </div>

      <div className="product-info">
        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className="product-title">{product.title}</h3>
          <p className="product-price">
            ₦{parseFloat(product.price || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
