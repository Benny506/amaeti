import React, { useState } from 'react';

import { SUPABASE_STORAGE_URL } from '../../supabase';

const ShowcaseCard = ({ item }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="showcase-card">
      <div className="showcase-media-wrapper">
        {/* Simple static solid skeleton loader */}
        {!isLoaded && <div className="showcase-skeleton"></div>}

        {item.src && item.type === 'video' && (
          <video 
            src={item.src.startsWith('http') ? item.src : SUPABASE_STORAGE_URL + 'site_content/' + item.src}
            className="showcase-media-item"
            style={{ 
              filter: item.filter || 'none',
              opacity: isLoaded ? 1 : 0,
              transition: 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease'
            }}
            autoPlay 
            loop 
            muted 
            playsInline
            onLoadedData={() => setIsLoaded(true)}
          />
        )}
        {item.src && item.type === 'image' && (
          <img 
            src={item.src.startsWith('http') ? item.src : SUPABASE_STORAGE_URL + 'site_content/' + item.src}
            alt={item.name}
            className="showcase-media-item"
            style={{ 
              filter: item.filter || 'none',
              opacity: isLoaded ? 1 : 0,
              transition: 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease'
            }}
            onLoad={() => setIsLoaded(true)}
          />
        )}
      </div>

      <div className="showcase-info">
        <h3 className="showcase-product-name">{item.name}</h3>
        <span className="showcase-product-price">{item.price}</span>
      </div>
    </div>
  );
};

const ShowcaseSection = ({ content = {} }) => {
  const items = content.items || [];
  
  return (
    <section className="showcase-section">
      <div className="showcase-header">
        <h2 className="showcase-title">{content.title}</h2>
        <p className="showcase-subtitle">
          {content.subtitle}
        </p>
      </div>

      <div className="showcase-track-container">
        <div className="showcase-track">
          {items.map((item, index) => (
            <ShowcaseCard key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
