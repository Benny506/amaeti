import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { fetchProducts, setFilters, incrementPage, resetProducts } from '../store/productsSlice';
import FloatingFilter from '../components/products/FloatingFilter';
import ProductCard from '../components/products/ProductCard';
import '../styles/Products.css';

const Products = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { items, status, pagination, filters, lastFetched } = useSelector(state => state.products);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categorySlug = searchParams.get('category');
    if (categorySlug && categorySlug !== filters.category) {
      dispatch(setFilters({ ...filters, category: categorySlug }));
    } else {
      if (status === 'idle') {
        dispatch(fetchProducts({ page: 1, limit: pagination.limit, filters }));
      } else if (lastFetched && (Date.now() - lastFetched > 60000)) {
        dispatch(fetchProducts({ page: 1, limit: pagination.limit, filters }));
      }
    }
  }, [location.search]);

  useEffect(() => {
    if (status === 'idle' || (status === 'succeeded' && pagination.page > 1)) {
      dispatch(fetchProducts({ page: pagination.page, limit: pagination.limit, filters }));
    }
  }, [filters, pagination.page, status, dispatch, pagination.limit]);

  const handleLoadMore = () => {
    dispatch(incrementPage());
  };

  const isLoading = status === 'loading';
  const isFetchingMore = status === 'loading_more';
  const isEmpty = status === 'succeeded' && items.length === 0;

  return (
    <div className="products-page">
      <div className="shop-header">
        <h1 className="shop-title">The Collection</h1>
        <p className="shop-desc">
          {filters.category ? `Exploring the ${filters.category.replace('dummy-', '')} collection.` : 'Discover our full range of masterfully crafted pieces.'}
        </p>
      </div>

      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '40vh' }}>
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : isEmpty ? (
        <div className="empty-state">
          <h2>No pieces found</h2>
          <p>We couldn't find any items matching your current refined search.</p>
          <button 
            className="clear-filters-btn"
            onClick={() => dispatch(setFilters({ search: '', category: '', minPrice: '', maxPrice: '' }))}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {pagination.hasMore && !isLoading && !isEmpty && (
        <div className="load-more-container">
          <button 
            className="load-more-btn" 
            onClick={handleLoadMore}
            disabled={isFetchingMore}
          >
            {isFetchingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      <FloatingFilter />
    </div>
  );
};

export default Products;
