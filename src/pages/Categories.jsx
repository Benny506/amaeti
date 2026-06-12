import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../store/categoriesSlice';
import '../styles/Categories.css';

const Categories = () => {
  const dispatch = useDispatch();
  const { items: categories, status } = useSelector(state => state.categories);
  const loading = status === 'loading' || status === 'idle';

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredCategories = categories.filter(category => {
    const term = searchTerm.toLowerCase();
    return (
      (category.title && category.title.toLowerCase().includes(term)) ||
      (category.description && category.description.toLowerCase().includes(term))
    );
  });

  return (
    <div className="categories-page" style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: 'var(--color-bg-light)', overflowX: 'hidden' }}>
      <div className="section-padding products-wrapper" style={{ paddingBottom: '30px' }}>
        <div className="section-header" style={{ marginBottom: '30px', textAlign: 'center' }}>
          <span className="letter-spaced-title">Curated For You</span>
          <h1 className="section-main-title">Collections</h1>
          <p className="hero-desc" style={{ marginTop: '15px', maxWidth: '600px', margin: '15px auto 30px' }}>
            Explore our beautifully crafted collections, designed to elevate your everyday elegance.
          </p>

          <div className="search-container" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search collections..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: '0',
                border: '1px solid #ddd',
                padding: '12px 20px',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                backgroundColor: 'transparent'
              }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '40vh' }}>
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center" style={{ padding: '80px 0' }}>
          <p className="hero-desc">No collections found matching your search.</p>
        </div>
      ) : (
        <div className="zigzag-container">
          {filteredCategories.map((category, index) => (
            <div key={category.id + index} className="category-row">
              <div className="category-img-col">
                <div className="parallax-container">
                  <img 
                    src={category.coverImage} 
                    alt={category.title} 
                    className="category-image parallax-img"
                  />
                </div>
              </div>
              
              <div className="category-text-col">
                <div className="text-content">
                  <h2 className="category-title">{category.title}</h2>
                  
                  {category.description && (
                    <p className="category-desc">{category.description}</p>
                  )}
                  
                  <Link to={`/products?category=${category.slug}`} className="explore-btn">
                    Explore Collection
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
