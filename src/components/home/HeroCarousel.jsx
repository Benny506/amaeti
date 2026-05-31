import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToast } from '../../store/uiSlice';

import { SUPABASE_STORAGE_URL } from '../../supabase';

const HeroCarousel = ({ content }) => {
  const slides = content?.slides || [];
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRefs = useRef([]);
  const dispatch = useDispatch();

  const handleComingSoon = (e) => {
    e.preventDefault();
    dispatch(addToast({ type: 'info', message: 'Coming Soon' }));
  };

  // Control video playback based on the active slide
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === currentSlide) {
        video.currentTime = 0;
        video.play().catch(e => console.log('Video play interrupted:', e));
      } else {
        video.pause();
      }
    });
  }, [currentSlide]);

  const handleVideoEnd = (index) => {
    if (index === currentSlide) {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <section className="hero-wrapper position-relative overflow-hidden" style={{ height: '110vh', backgroundColor: '#e5e0d8' }}>
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
            {/* Background Video (Only render if src exists) */}
            {slide.video_src && (
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={SUPABASE_STORAGE_URL + 'site_content/' + slide.video_src}
                muted
              playsInline
              onEnded={() => handleVideoEnd(index)}
              className="hero-bg-video"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            )}
            <div 
              className="hero-overlay-dark position-absolute top-0 start-0 w-100 h-100" 
              style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.2) 75%, transparent 100%)' }}
            ></div>

            {/* Card Content */}
            <div className="hero-content-panel h-100 d-flex align-items-center position-relative z-3" style={{ paddingLeft: '5%', maxWidth: '1200px', margin: '0 auto' }}>
              <div
                className="hero-text-block"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s'
                }}
              >
                <span className="letter-spaced-title mb-3 d-block">{slide.subtitle}</span>
                <h1 className="hero-title mb-4" style={{ minHeight: 'auto' }}>
                  {slide.title}
                </h1>
                <p className="hero-desc mb-5" style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(15px)',
                  transition: 'opacity 1s ease 0.7s, transform 1s ease 0.7s'
                }}>
                  {slide.desc}
                </p>
                <a
                  href="#collections"
                  onClick={handleComingSoon}
                  className="luxe-btn d-inline-flex align-items-center"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'translateY(0)' : 'translateY(15px)',
                    transition: 'opacity 1s ease 0.9s, transform 1s ease 0.9s'
                  }}
                >
                  {slide.button_text} <ArrowRight size={14} className="ms-2" />
                </a>
              </div>
            </div>
          </div>
        );
      })}

      {slides.length > 1 && (
        <div className="position-absolute bottom-0 end-0 p-5 z-3 d-flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (currentSlide !== index) {
                  setCurrentSlide(index);
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
      )}
    </section>
  );
};

export default HeroCarousel;
