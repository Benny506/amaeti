import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import TypewriterText from '../ui/TypewriterText';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    subtitle: 'NEW SEASON COLLECTION',
    title: 'Abstract expression of art & form.',
    desc: 'Designed with architectural silhouettes, muted natural tones, and premium organic fabrics for the contemporary wardrobe.',
    link: '#collections'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    subtitle: 'THE ATELIER EXCLUSIVE',
    title: 'A curation of sculptural silhouettes.',
    desc: 'Each piece is an envelope of form, natural fabric, and sculptured silhouette built from organic symmetry.',
    link: '#atelier'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    subtitle: 'ORGANIC SYMMETRY',
    title: 'Wearable canvases for the modern muse.',
    desc: 'Embracing the intersection of minimalist design and high-fashion architecture.',
    link: '#philosophy'
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);

  // Auto-advance slides every 10 seconds (slower to accommodate the slower typing)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setTypingComplete(false);
    }, 10000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <section className="hero-wrapper position-relative overflow-hidden" style={{ height: '90vh', backgroundColor: '#e5e0d8' }}>
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              opacity: isActive ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
              zIndex: isActive ? 10 : 1
            }}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="hero-bg-image"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 10s ease-out'
              }}
            />
            <div className="hero-overlay-dark position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.75) 35%, rgba(0,0,0,0.3) 65%, transparent 100%)' }}></div>

            {/* Card Content */}
            <div className="hero-content-panel h-100 d-flex align-items-center position-relative z-3">
              <div
                className="hero-text-block"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s'
                }}
              >
                <span className="letter-spaced-title">{slide.subtitle}</span>
                <h1 className="hero-title" style={{ minHeight: '120px' }}>
                  {isActive ? (
                    <TypewriterText
                      text={slide.title}
                      delay={80}
                      isActive={true}
                      onComplete={() => setTypingComplete(true)}
                    />
                  ) : null}
                  {isActive && !typingComplete && <span className="blinking-cursor" style={{ animation: 'blink 1s step-end infinite' }}>|</span>}
                </h1>
                <p className="hero-desc" style={{
                  opacity: typingComplete && isActive ? 1 : 0,
                  transform: typingComplete && isActive ? 'translateY(0)' : 'translateY(15px)',
                  transition: 'opacity 1s ease, transform 1s ease'
                }}>
                  {slide.desc}
                </p>
                <a
                  href={slide.link}
                  className="luxe-btn"
                  style={{
                    opacity: typingComplete && isActive ? 1 : 0,
                    transform: typingComplete && isActive ? 'translateY(0)' : 'translateY(15px)',
                    transition: 'opacity 1s ease 0.2s, transform 1s ease 0.2s'
                  }}
                >
                  Explore Collection <ArrowRight size={14} className="ms-2" />
                </a>
              </div>
            </div>
          </div>
        );
      })}

      {/* Manual Controls */}
      <div className="position-absolute bottom-0 end-0 p-5 z-3 d-flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (currentSlide !== index) {
                setCurrentSlide(index);
                setTypingComplete(false);
              }
            }}
            style={{
              width: '40px',
              height: '3px',
              backgroundColor: currentSlide === index ? 'var(--color-bg-light)' : 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
