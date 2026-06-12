import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingCart } from 'lucide-react';
import { supabase, resolveImageUrl } from '../supabase';
import { dummyProductsCache } from '../lib/dummyData';
import { addCartItemAsync } from '../store/cartSlice';
import { showBlockingLoader, hideBlockingLoader, addToast, showSubtleLoader, hideSubtleLoader } from '../store/uiSlice';
import '../styles/SingleProduct.css';

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  const isDummy = id.startsWith('dummy');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(false);
      dispatch(showBlockingLoader('Loading product...'));

      try {
        if (isDummy) {
          const dummyProd = dummyProductsCache.find(p => p.id === id);
          if (!dummyProd) throw new Error("Not found");

          setProduct(dummyProd);

          // Select first active variant or just first variant
          const firstVariant = dummyProd.product_variants?.[0];
          if (firstVariant) {
            setSelectedVariant(firstVariant);
            setActiveImage(firstVariant.product_media?.[0]?.media_url || 'https://via.placeholder.com/600x800?text=No+Image');
          }
        } else {
          // Fetch from Supabase
          const { data, error: sbError } = await supabase
            .from('products')
            .select(`
              id, title, description, slug, is_active,
              categories (id, title, slug),
              product_variants (
                id, title, price, compare_at_price, is_active, inventory_quantity, attributes, weight, features,
                product_media ( media_url, media_type )
              )
            `)
            .eq('id', id)
            .eq('is_active', true)
            .single();

          if (sbError || !data) {
            console.log(sbError)
            throw new Error("Product not found or inactive")
          };

          // Filter only active variants
          data.product_variants = data.product_variants.filter(v => v.is_active);

          if (data.product_variants.length === 0) {
            throw new Error("No active variants available");
          }

          setProduct(data);

          // Randomize default variant as requested
          const randomIdx = Math.floor(Math.random() * data.product_variants.length);
          const defaultVariant = data.product_variants[randomIdx];

          setSelectedVariant(defaultVariant);

          // Find an image for the active variant
          const img = defaultVariant.product_media?.find(m => m.media_type === 'image');
          setActiveImage(img ? resolveImageUrl(img.media_url) : 'https://via.placeholder.com/600x800?text=No+Image');
        }
      } catch (err) {
        console.error("Fetch product error:", err);
        setError(true);
      } finally {
        setLoading(false);
        dispatch(hideBlockingLoader());
      }
    };

    fetchProduct();
  }, [id, isDummy, dispatch]);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity when changing variant

    // Update image based on variant
    if (isDummy) {
      const img = variant.product_media?.[0]?.media_url;
      if (img) setActiveImage(img);
    } else {
      const img = variant.product_media?.find(m => m.media_type === 'image');
      if (img) setActiveImage(resolveImageUrl(img.media_url));
    }
  };

  const handleQuantityChange = (type) => {
    if (type === 'dec') {
      setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    } else {
      // If variant has quantity limit, respect it
      const maxQty = selectedVariant?.inventory_quantity || 99;
      setQuantity(prev => (prev < maxQty ? prev + 1 : prev));
    }
  };

  const handleAddToCart = async () => {
    if (isDummy || !selectedVariant || !product) return;

    dispatch(showSubtleLoader('Adding to Cart...'));

    try {
      await dispatch(addCartItemAsync({
        product_id: product.id,
        variant_id: selectedVariant.id,
        quantity: quantity,
        price: selectedVariant.price,
        title: product.title,
        slug: product.slug,
        image: activeImage,
        weight: selectedVariant.weight || 1.0,
        attributes: selectedVariant.attributes || null
      })).unwrap();

      dispatch(addToast({
        type: 'success',
        message: 'Item added to cart'
      }));
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        message: 'Failed to add item to cart'
      }));
    } finally {
      dispatch(hideSubtleLoader());
    }
  };

  if (loading) {
    return null; // The blocking loader handles the UI
  }

  if (error || !product) {
    return (
      <div className="container sp-not-found pt-5 mt-5">
        <h1>Product Not Found</h1>
        <p>The product you are looking for does not exist or is no longer available.</p>
        <Link to="/products" className="sp-add-to-cart-btn" style={{ maxWidth: '250px', margin: '0 auto', textDecoration: 'none' }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container single-product-page">
      <div className="sp-layout">

        {/* Left Column: Image */}
        <div className="sp-image-column">
          <img
            src={activeImage}
            alt={product.title}
            className="sp-main-image"
          />
          {/* Thumbnails (just showing the active image and maybe placeholder for now) */}
          <div className="sp-thumbnail-list px-3">
            <img
              src={activeImage}
              alt="thumbnail"
              className="sp-thumbnail active"
            />
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="sp-info-column">
          <div>
            <div className="sp-category">{product.categories?.title || product.category?.title || 'General'}</div>
            <h1 className="sp-title">{product.title}</h1>
            <div className="d-flex align-items-center" style={{ gap: '12px' }}>
              <p className="sp-price mb-0">
                ₦{parseFloat(selectedVariant?.price || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              {selectedVariant?.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price && (
                <p className="sp-price text-muted text-decoration-line-through mb-0" style={{ fontSize: '18px' }}>
                  ₦{parseFloat(selectedVariant.compare_at_price).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )}
            </div>
          </div>

          <div className="sp-description">
            {product.description}
          </div>

          {product.product_variants?.length > 0 && (
            <div className="sp-variants-section">
              <div className="sp-variants-label">Select Variant</div>
              <div className="sp-variants-list mb-3">
                {product.product_variants.map((variant, index) => {
                  const label = variant.title || `Variant ${index + 1}`;
                  return (
                    <button
                      key={variant.id}
                      className={`sp-variant-pill ${selectedVariant?.id === variant.id ? 'active' : ''}`}
                      onClick={() => handleVariantChange(variant)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Variant Details / Attributes display */}
              {selectedVariant && ((Array.isArray(selectedVariant.attributes) && selectedVariant.attributes.length > 0) || (!Array.isArray(selectedVariant.attributes) && selectedVariant.attributes && Object.keys(selectedVariant.attributes).length > 0) || (selectedVariant.features && selectedVariant.features.length > 0)) && (
                <div className="p-3 bg-light rounded border mt-3">
                  <div className="fw-bold mb-3" style={{ fontSize: '14px' }}>Variant Details:</div>
                  <div className="row g-3">
                    {/* Render Attributes */}
                    {selectedVariant.attributes && Array.isArray(selectedVariant.attributes)
                      ? selectedVariant.attributes.map((a, i) => (
                        <div className="col-6 col-sm-4" key={i}>
                          <div className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{a.key}</div>
                          <div className="fw-medium" style={{ fontSize: '13px', color: 'var(--color-text-dark)' }}>{a.value}</div>
                        </div>
                      ))
                      : selectedVariant.attributes && Object.entries(selectedVariant.attributes).map(([key, val]) => (
                        <div className="col-6 col-sm-4" key={key}>
                          <div className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{key}</div>
                          <div className="fw-medium" style={{ fontSize: '13px', color: 'var(--color-text-dark)' }}>{val}</div>
                        </div>
                      ))
                    }
                  </div>

                  {/* Render Features */}
                  {selectedVariant.features && selectedVariant.features.length > 0 && (
                    <div className="mt-3 pt-3" style={{ borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                      <div className="text-muted mb-2" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Features included</div>
                      <ul className="mb-0 ps-3" style={{ fontSize: '13px', color: 'var(--color-text-dark)' }}>
                        {selectedVariant.features.map((feature, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {selectedVariant && (
                <div className="mt-3 d-flex align-items-center gap-2" style={{ fontSize: '13px' }}>
                  <span className="text-muted">
                    {typeof selectedVariant.inventory_quantity === 'number' ?
                      `${selectedVariant.inventory_quantity} in stock` : 'In stock'}
                  </span>
                  {typeof selectedVariant.inventory_quantity === 'number' && selectedVariant.inventory_quantity <= 0 && (
                    <span className="badge bg-danger rounded-pill px-2 py-1">Out of Stock</span>
                  )}
                  {typeof selectedVariant.inventory_quantity === 'number' && selectedVariant.inventory_quantity > 0 && selectedVariant.inventory_quantity <= 3 && (
                    <span className="badge bg-warning text-dark rounded-pill px-2 py-1">Low Stock</span>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="sp-quantity-section mt-4">
            <div className="sp-variants-label">Quantity</div>
            <div className="d-flex align-items-center" style={{ gap: '16px' }}>
              <div className="quantity-selector d-flex align-items-center" style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
                <button
                  className="btn btn-light px-3 py-2 border-0 bg-transparent"
                  onClick={() => handleQuantityChange('dec')}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-3 py-2 font-weight-bold" style={{ minWidth: '40px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  className="btn btn-light px-3 py-2 border-0 bg-transparent"
                  onClick={() => handleQuantityChange('inc')}
                  disabled={selectedVariant?.inventory_quantity && quantity >= selectedVariant.inventory_quantity}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            className="sp-add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={isDummy || (selectedVariant?.inventory_quantity === 0)}
          >
            <ShoppingCart size={18} />
            {isDummy ? 'Unavailable for Demo Items' : selectedVariant?.inventory_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SingleProduct;
