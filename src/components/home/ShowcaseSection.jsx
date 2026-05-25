import React, { useState } from 'react';

// Import local videos
import vid1 from '../../assets/tempVids/vid1.mp4';
import vid3 from '../../assets/tempVids/vid3.mp4';
import vid4 from '../../assets/tempVids/vid4.mp4';

const showcaseItems = [
  {
    id: 's1',
    name: 'The Structured Trench',
    price: '$1,250',
    type: 'video',
    src: vid1,
    filter: 'sepia(0.1) contrast(1.1)'
  },
  {
    id: 's2',
    name: 'Pleated Silk Blouse',
    price: '$680',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    filter: 'none'
  },
  {
    id: 's3',
    name: 'Cashmere Overcoat',
    price: '$2,100',
    type: 'video',
    src: vid3,
    filter: 'grayscale(0.2)'
  },
  {
    id: 's4',
    name: 'Tailored Wide-Leg Trouser',
    price: '$850',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&w=800&q=80',
    filter: 'none'
  },
  {
    id: 's5',
    name: 'Evening Plunge Gown',
    price: '$3,400',
    type: 'video',
    src: vid4,
    filter: 'contrast(1.05)'
  },
  {
    id: 's6',
    name: 'Minimalist Leather Tote',
    price: '$1,800',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    filter: 'sepia(0.2)'
  },
  {
    id: 's7',
    name: 'Sculptural Knit Dress',
    price: '$1,150',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
    filter: 'grayscale(0.3)'
  },
  {
    id: 's8',
    name: 'Oversized Blazer',
    price: '$1,400',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1485230895905-ef05988225bd?auto=format&fit=crop&w=800&q=80',
    filter: 'none'
  }
];

const ShowcaseCard = ({ item }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="showcase-card">
      <div className="showcase-media-wrapper">
        {/* Simple static solid skeleton loader */}
        {!isLoaded && <div className="showcase-skeleton"></div>}

        {item.type === 'video' ? (
          <video 
            src={item.src}
            className="showcase-media-item"
            style={{ 
              filter: item.filter,
              opacity: isLoaded ? 1 : 0,
              transition: 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease'
            }}
            autoPlay 
            loop 
            muted 
            playsInline
            onLoadedData={() => setIsLoaded(true)}
          />
        ) : (
          <img 
            src={item.src} 
            alt={item.name}
            className="showcase-media-item"
            style={{ 
              filter: item.filter,
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

const ShowcaseSection = () => {
  return (
    <section className="showcase-section">
      <div className="showcase-header">
        <h2 className="showcase-title">The Potential Archive</h2>
        <p className="showcase-subtitle">
          A glimpse into the future of the Amaeti collection. Designed for the modern sophisticate.
        </p>
      </div>

      <div className="showcase-track-container">
        <div className="showcase-track">
          {showcaseItems.map(item => (
            <ShowcaseCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
