import sys

code = """import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const rawSlides = [
  {
    id: 1,
    left: { 
      title: "Linen & Canvas", 
      type: "image", 
      src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80", 
      filter: 'sepia(0.2)' 
    },
    right: { 
      title: "Atelier Silks", 
      type: "video", 
      src: "https://res.cloudinary.com/demo/video/upload/v1643203498/docs/fashion_shoot.mp4", 
      filter: 'hue-rotate(15deg) contrast(1.1)' 
    }
  },
  {
    id: 2,
    left: { 
      title: "Outerwear", 
      type: "image", 
      src: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=80", 
      filter: 'grayscale(1)' 
    },
    right: { 
      title: "Knitwear", 
      type: "video", 
      src: "https://res.cloudinary.com/demo/video/upload/v1643202951/docs/woman_walking.mp4", 
      filter: 'grayscale(0.5) contrast(1.2)' 
    }
  },
  {
    id: 3,
    left: { 
      title: "Handbags", 
      type: "image", 
      src: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80", 
      filter: 'contrast(1.1)' 
    },
    right: { 
      title: "Footwear", 
      type: "image", 
      src: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80", 
      filter: 'sepia(0.1)' 
    }
  },
  {
    id: 4,
    left: { 
      title: "Accessories", 
      type: "image", 
      src: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80", 
      filter: 'brightness(0.8)' 
    },
    right: { 
      title: "Swimwear", 
      type: "video", 
      src: "https://res.cloudinary.com/demo/video/upload/v1642602497/docs/walking_man.mp4", 
      filter: 'sepia(0.3) brightness(0.9)' 
    }
  },
  {
    id: 5,
    left: { 
      title: "Tailoring", 
      type: "image", 
      src: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80", 
      filter: 'grayscale(0.5)' 
    },
    right: { 
      title: "Eveningwear", 
      type: "image", 
      src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80", 
      filter: 'sepia(0.3)' 
    }
  }
];

const mobileSlides = rawSlides.flatMap((slide, i) => [
  { ...slide.left, id: `${slide.id}-L`, zIndex: i * 2 + 1 },
  { ...slide.right, id: `${slide.id}-R`, zIndex: i * 2 + 2 }
]);

const desktopSlides = rawSlides.map((slide, i) => ({
  ...slide,
  zIndex: i + 1
}));

// Reusable Media Component that handles both images and videos seamlessly
const MediaItem = ({ data }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="panel-img-wrapper" style={{ backgroundColor: 'var(--color-bg-dark)' }}>
      {/* Loading Skeleton */}
      {!isLoaded && (
        <div 
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: '#1a1a1a',
            zIndex: 10,
            animation: 'pulse 1.5s infinite ease-in-out'
          }}
        />
      )}

      {data.type === 'video' ? (
        <video 
          src={data.src}
          style={{ 
            filter: data.filter, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.8s ease'
          }}
          autoPlay 
          loop 
          muted 
          playsInline
          onLoadedData={() => setIsLoaded(true)}
        />
      ) : (
        <img 
          src={data.src} 
          style={{ 
            filter: data.filter,
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.8s ease'
          }} 
          alt={data.title} 
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
};

const FeaturedCollection = () => {
  const containerRef = useRef();
  
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  useGSAP(() => {
    const firstPanelText = gsap.utils.toArray('.gallery-panel:first-child .reveal-item');
    gsap.fromTo(firstPanelText,
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.1, ease: "power2.out", duration: 0.8,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      }
    );

    const panelElements = gsap.utils.toArray('.gallery-panel:not(:first-child)');
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${panelElements.length * 100}%`,
        scrub: 1,
        pin: true,
        anticipatePin: 1
      }
    });

    panelElements.forEach((panel) => {
      if (isMobile) {
        const imgWrapper = panel.querySelector('.panel-img-wrapper');
        const textItems = panel.querySelectorAll('.reveal-item');
        
        tl.fromTo(panel, { yPercent: 100 }, { yPercent: 0, ease: "none" });
        tl.fromTo(imgWrapper, { yPercent: -15 }, { yPercent: 0, ease: "none" }, "<");
        tl.fromTo(textItems, { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, ease: "power2.out", duration: 0.5 }, "<0.2");
      } else {
        const leftCol = panel.querySelector('.gallery-panel-col:first-child');
        const rightCol = panel.querySelector('.gallery-panel-col:last-child');
        
        const leftImg = leftCol.querySelector('.panel-img-wrapper');
        const rightImg = rightCol.querySelector('.panel-img-wrapper');
        
        const leftText = leftCol.querySelectorAll('.reveal-item');
        const rightText = rightCol.querySelectorAll('.reveal-item');

        tl.fromTo(leftCol, { yPercent: 100 }, { yPercent: 0, ease: "none" });
        tl.fromTo(rightCol, { yPercent: 100 }, { yPercent: 0, ease: "none" }, "<0.15");

        tl.fromTo(leftImg, { yPercent: -15 }, { yPercent: 0, ease: "none" }, "<");
        tl.fromTo(rightImg, { yPercent: -15 }, { yPercent: 0, ease: "none" }, "<");

        tl.fromTo(leftText, { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, ease: "power2.out", duration: 0.5 }, "<0.2");
        tl.fromTo(rightText, { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, ease: "power2.out", duration: 0.5 }, "<0.2");
      }
    });
  }, { scope: containerRef, dependencies: [isMobile] });

  return (
    <section ref={containerRef} id="collections" className="gallery-container">
      {/* Required for the pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.4; }
            50% { opacity: 0.8; }
            100% { opacity: 0.4; }
          }
        `}
      </style>
      
      {isMobile ? (
        mobileSlides.map((slide) => (
          <div key={slide.id} className="gallery-panel" style={{ zIndex: slide.zIndex }}>
            <div className="gallery-panel-col" style={{ width: '100%', height: '100vh', border: 'none' }}>
              <MediaItem data={slide} />
              <div className="panel-scrim"></div>
              <div className="panel-content">
                <h2 className="panel-title reveal-item">{slide.title}</h2>
              </div>
            </div>
          </div>
        ))
      ) : (
        desktopSlides.map((slide) => (
          <div key={slide.id} className="gallery-panel" style={{ zIndex: slide.zIndex }}>
            {/* LEFT COLUMN */}
            <div className="gallery-panel-col">
              <MediaItem data={slide.left} />
              <div className="panel-scrim"></div>
              <div className="panel-content">
                <h2 className="panel-title reveal-item">{slide.left.title}</h2>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="gallery-panel-col">
              <MediaItem data={slide.right} />
              <div className="panel-scrim"></div>
              <div className="panel-content">
                <h2 className="panel-title reveal-item">{slide.right.title}</h2>
              </div>
            </div>
          </div>
        ))
      )}
    </section>
  );
};

export default FeaturedCollection;
"""

with open('src/components/home/FeaturedCollection.jsx', 'w') as f:
    f.write(code)

