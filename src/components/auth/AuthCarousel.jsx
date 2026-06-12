import React, { useState, useEffect } from 'react';
import '../../styles/Auth.css';

const carouselData = [
  {
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=1200&auto=format&fit=crop',
    title: 'Welcome Back.',
    description: 'Sign in to access your bespoke collection and exclusive pieces.'
  },
  {
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop',
    title: 'Curated For You.',
    description: 'Discover new arrivals handpicked by our master stylists.'
  },
  {
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop',
    title: 'Elevate Your Style.',
    description: 'Redefining modern luxury through unparalleled craftsmanship.'
  }
];

const AuthCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselData.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="auth-image-side">
      {carouselData.map((slide, index) => (
        <div 
          key={index} 
          className={`auth-carousel-slide ${index === currentIndex ? 'active' : ''}`}
        >
          <img 
            src={slide.image} 
            alt="Editorial fashion" 
            className="auth-hero-img"
          />
        </div>
      ))}
      <div className="auth-image-overlay">
        <div className="auth-image-content">
          <h2 className="carousel-title" key={`title-${currentIndex}`}>{carouselData[currentIndex].title}</h2>
          <p className="carousel-desc" key={`desc-${currentIndex}`}>{carouselData[currentIndex].description}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCarousel;
