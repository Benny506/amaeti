import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../../store/productsSlice';
import { Filter, X, Search } from 'lucide-react';
import { dummyCategoriesCache } from '../../lib/dummyData';
import { supabase } from '../../supabase';

const FloatingFilter = () => {
  const dispatch = useDispatch();
  const currentFilters = useSelector(state => state.products.filters);
  const [isOpen, setIsOpen] = useState(false);
  
  // Local state for the form so we don't dispatch on every keystroke
  const [localFilters, setLocalFilters] = useState(currentFilters);
  const [categories, setCategories] = useState([]);

  // Fetch real categories to populate dropdown
  useEffect(() => {
    const fetchCats = async () => {
      const { data } = await supabase
        .from('categories')
        .select('slug, title')
        .order('title');
      
      const realCats = data || [];
      const dummyCats = dummyCategoriesCache.map(c => ({ slug: c.slug, title: c.title }));
      setCategories([...realCats, ...dummyCats]);
    };
    fetchCats();
  }, []);

  // Sync local filters if they change externally (e.g. via URL)
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleApply = (e) => {
    e.preventDefault();
    dispatch(setFilters(localFilters));
    setIsOpen(false);
  };

  const handleClear = () => {
    const cleared = { search: '', category: '', minPrice: '', maxPrice: '' };
    setLocalFilters(cleared);
    dispatch(setFilters(cleared));
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        className="floating-filter-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Open Filters"
      >
        <Filter size={24} />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="filter-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="filter-modal-content" onClick={e => e.stopPropagation()}>
            <div className="filter-header">
              <h3>Refine</h3>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleApply} className="filter-form">
              
              {/* Search */}
              <div className="filter-group">
                <label>Search</label>
                <div className="search-input-wrapper">
                  <Search size={18} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Keywords..." 
                    value={localFilters.search}
                    onChange={e => setLocalFilters({...localFilters, search: e.target.value})}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="filter-group">
                <label>Collection</label>
                <select 
                  value={localFilters.category}
                  onChange={e => setLocalFilters({...localFilters, category: e.target.value})}
                >
                  <option value="">All Collections</option>
                  {categories.map((c, i) => (
                    <option key={i} value={c.slug}>{c.title}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="filter-group">
                <label>Price Range</label>
                <div className="price-inputs">
                  <input 
                    type="number" 
                    placeholder="Min $" 
                    value={localFilters.minPrice}
                    onChange={e => setLocalFilters({...localFilters, minPrice: e.target.value})}
                  />
                  <span className="separator">-</span>
                  <input 
                    type="number" 
                    placeholder="Max $" 
                    value={localFilters.maxPrice}
                    onChange={e => setLocalFilters({...localFilters, maxPrice: e.target.value})}
                  />
                </div>
              </div>

              <div className="filter-actions">
                <button type="button" className="clear-btn" onClick={handleClear}>Clear</button>
                <button type="submit" className="apply-btn">Apply Filters</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .floating-filter-btn {
          position: fixed;
          bottom: 40px;
          right: 40px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: var(--color-text-dark);
          color: #fff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          cursor: pointer;
          z-index: 1000;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .floating-filter-btn:hover {
          transform: scale(1.1);
        }

        .filter-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background-color: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .filter-modal-content {
          background: #fff;
          width: 90%;
          max-width: 450px;
          padding: 40px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
          border: 1px solid rgba(0,0,0,0.05);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .filter-header h3 {
          font-family: var(--font-serif-display);
          font-size: 32px;
          margin: 0;
          color: var(--color-text-dark);
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #999;
          transition: color 0.2s;
          padding: 5px;
        }

        .close-btn:hover {
          color: #000;
        }

        .filter-group {
          margin-bottom: 30px;
        }

        .filter-group label {
          display: block;
          font-family: var(--font-sans);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #666;
          margin-bottom: 12px;
        }

        .search-input-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        input[type="text"],
        input[type="number"],
        select {
          width: 100%;
          padding: 15px;
          border: 1px solid #ddd;
          background: transparent;
          font-family: var(--font-sans);
          font-size: 15px;
          color: #000;
          transition: border-color 0.2s;
          appearance: none;
        }

        input[type="text"] {
          padding-left: 45px;
        }

        input:focus, select:focus {
          outline: none;
          border-color: #000;
        }

        .price-inputs {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .separator {
          color: #999;
        }

        .filter-actions {
          display: flex;
          gap: 15px;
          margin-top: 40px;
        }

        .apply-btn {
          flex: 2;
          background: #000;
          color: #fff;
          border: none;
          padding: 18px;
          font-family: var(--font-sans);
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: background 0.2s;
        }

        .apply-btn:hover {
          background: #333;
        }

        .clear-btn {
          flex: 1;
          background: transparent;
          color: #000;
          border: 1px solid #ddd;
          padding: 18px;
          font-family: var(--font-sans);
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-btn:hover {
          border-color: #000;
        }
      `}</style>
    </>
  );
};

export default FloatingFilter;
