import React, { useEffect, useRef, useState } from 'react';
// import AnimatedMonogram from '../ui/AnimatedMonogram';
// import AnimatedWordmark from '../ui/AnimatedWordmark';
import logoWordmark from '../../assets/logo-wordmark.svg';
import logoMonogram from '../../assets/logo.svg';

const AtelierSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  // const [isDrawing, setIsDrawing] = useState(true);
  const sectionRef = useRef(null);

  // Scroll visibility observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 } 
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Master animation synchronization loop:
  // Phase 1: Draw IN (takes ~10s) + Pause 1.5s = 11.5s
  // Phase 2: Draw OUT (reverse draw, takes 9.0s) + Pause 0.05s = 9.05s
  /*
  useEffect(() => {
    let isMounted = true;
    
    const runCycle = async () => {
      while(isMounted) {
        setIsDrawing(true);
        await new Promise(r => setTimeout(r, 11500));
        
        if(!isMounted) break;
        
        setIsDrawing(false);
        await new Promise(r => setTimeout(r, 9050));
      }
    };
    
    runCycle();
    
    return () => {
      isMounted = false;
    };
  }, []);
  */

  return (
    <section id="atelier" className="section-padding intro-section" ref={sectionRef}>
      <div className="intro-grid">
        <div 
          className="intro-content"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1) 0.1s, transform 1.2s cubic-bezier(0.25, 1, 0.5, 1) 0.1s'
          }}
        >
          <span className="letter-spaced-title">THE ATELIER PHILOSOPHY</span>
          <h2 className="intro-quote">"Fashion is wearable abstract expressionism."</h2>
          <p className="intro-body">
            At <strong>amaeti</strong>, our design language is defined by the intersection of fine craftsmanship and organic geometry. Drawing inspiration from contemporary sculpture and natural textures, we forge garments that sit harmoniously on the human form while asserting a bold, architectural voice.
          </p>
          <div className="d-flex gap-4">
            <a href="/#philosophy" className="luxe-btn luxe-btn-outline">Our Story</a>
            <a href="/#collections" className="luxe-btn">Shop Atelier</a>
          </div>
        </div>

        {/* Coded Brand Display - Paper Card Texture */}
        <div 
          className="plaque-display-container" 
          style={{ 
            background: '#0F0F0F', 
            padding: '50px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1) 0.3s, transform 1.2s cubic-bezier(0.25, 1, 0.5, 1) 0.3s'
          }}
        >
          <div 
            className="paper-card d-flex flex-column align-items-center justify-content-center" 
            style={{ 
              width: '100%', 
              padding: '60px 40px'
            }}
          >
            {/* <AnimatedMonogram isDrawing={isDrawing} style={{ height: '160px', marginBottom: '35px', filter: 'brightness(0)' }} /> */}
            {/* <AnimatedWordmark isDrawing={isDrawing} style={{ width: '100%', maxWidth: '340px' }} /> */}
            
            <div className="d-flex flex-column align-items-center justify-content-center">
              <img src={logoMonogram} alt="amaeti icon" style={{ height: '120px', marginBottom: '30px', filter: 'brightness(0)' }} />
              <img src={logoWordmark} alt="amaeti wordmark" style={{ width: '100%', maxWidth: '280px', filter: 'brightness(0)' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AtelierSection;
