import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../store/categoriesSlice';
import { toggleCart, selectCartItemCount, clearCart } from '../../store/cartSlice';
import { clearAuthData } from '../../store/authSlice';
import { showBlockingLoader, hideBlockingLoader } from '../../store/uiSlice';
import { supabase } from '../../supabase';
import logoWordmark from '../../assets/logo-wordmark.svg';
import logoMonogram from '../../assets/logo.svg';
import '../../styles/Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showExploreDropdown, setShowExploreDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  
  // Mobile accordion states
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: categories, status } = useSelector(state => state.categories);
  const itemCount = useSelector(selectCartItemCount);
  const { user, profile } = useSelector(state => state.auth);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const isTransparent = location.pathname === '/' && !isScrolled;

  return (
    <>
      <header className={`app-header ${isScrolled ? 'scrolled' : ''} ${isTransparent ? 'transparent' : ''}`}>
        <div className="container-fluid d-flex justify-content-between align-items-center w-100 p-0">
          
          <button className="mobile-menu-btn d-block d-lg-none" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>

          <nav className="nav-links d-none d-lg-flex">
            <Link to="/products" className={`nav-link-item ${location.pathname.startsWith('/products') ? 'active' : ''}`}>Shop</Link>
            
            {/* Categories Dropdown */}
            <div 
              className="nav-item-dropdown"
              onMouseEnter={() => setShowCategoriesDropdown(true)}
              onMouseLeave={() => setShowCategoriesDropdown(false)}
            >
              <div className="nav-link-item" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Categories <ChevronDown size={14} />
              </div>
              
              {showCategoriesDropdown && (
                <div className="dropdown-menu-custom">
                  <div className="dropdown-inner">
                    <Link to="/categories" className="dropdown-item view-all">View All</Link>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-scroll-area">
                      {categories.map((cat, idx) => (
                        <Link key={idx} to={`/products?category=${cat.slug}`} className="dropdown-item">
                          {cat.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Explore Dropdown (Home, About, Contact) */}
            <div 
              className="nav-item-dropdown"
              onMouseEnter={() => setShowExploreDropdown(true)}
              onMouseLeave={() => setShowExploreDropdown(false)}
            >
              <div className="nav-link-item" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Explore <ChevronDown size={14} />
              </div>
              
              {showExploreDropdown && (
                <div className="dropdown-menu-custom">
                  <div className="dropdown-inner">
                    <Link to="/" className="dropdown-item">Home</Link>
                    <Link to="/about" className="dropdown-item">About Us</Link>
                    <Link to="/contact" className="dropdown-item">Contact</Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <Link to="/" className="d-flex align-items-center justify-content-center">
            <img
              src={logoWordmark}
              alt="amaeti wordmark"
              className="nav-brand-img"
            />
          </Link>

          <div className="nav-actions d-none d-lg-flex">
            {user && profile ? (
              <Link to="/dashboard" className="nav-text-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={18} /> {profile.username}
              </Link>
            ) : (
              <Link to="/login" className="nav-text-btn">Log In</Link>
            )}
            <button className="nav-text-btn cart-btn" onClick={() => dispatch(toggleCart())}>
              Cart ({itemCount})
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-header">
            <div className="mobile-brand">
              <img src={logoMonogram} alt="amaeti icon" style={{ height: '45px' }} />
              <img src={logoWordmark} alt="amaeti wordmark" style={{ height: '30px' }} />
            </div>
            <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>
              <X size={28} />
            </button>
          </div>
          
          <div className="mobile-nav-list">
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Shop</Link>
            
            <div className="mobile-accordion">
              <div 
                className="mobile-nav-link" 
                onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
              >
                Categories <ChevronDown size={24} style={{ transform: mobileCategoriesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
              </div>
              {mobileCategoriesOpen && (
                <div className="mobile-dropdown-list">
                  <Link to="/categories" onClick={() => setMobileMenuOpen(false)} className="mobile-sublink">View All Categories</Link>
                  {categories.map((cat, idx) => (
                    <Link key={idx} to={`/products?category=${cat.slug}`} onClick={() => setMobileMenuOpen(false)} className="mobile-sublink">
                      {cat.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="mobile-accordion">
              <div 
                className="mobile-nav-link" 
                onClick={() => setMobileExploreOpen(!mobileExploreOpen)}
              >
                Explore <ChevronDown size={24} style={{ transform: mobileExploreOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
              </div>
              {mobileExploreOpen && (
                <div className="mobile-dropdown-list">
                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="mobile-sublink">Home</Link>
                  <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="mobile-sublink">About Us</Link>
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="mobile-sublink">Contact</Link>
                </div>
              )}
            </div>
          </div>

          <div className="mobile-actions">
            {user && profile ? (
              <Link to="/dashboard" className="nav-text-btn" style={{ color: '#fff', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setMobileMenuOpen(false)}>
                <User size={16} /> {profile.username}
              </Link>
            ) : (
              <Link to="/login" className="nav-text-btn" style={{ color: '#fff', fontSize: '14px', textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>Log In</Link>
            )}
            <button 
              className="nav-text-btn" 
              style={{ color: '#fff', fontSize: '14px' }}
              onClick={() => {
                setMobileMenuOpen(false);
                dispatch(toggleCart());
              }}
            >
              Cart ({itemCount})
            </button>
          </div>
        </div>
      )}

    </>
  );
};

export default Header;
