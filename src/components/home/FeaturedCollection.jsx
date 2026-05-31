import React, { useRef, useState, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

import { SUPABASE_STORAGE_URL } from '../../supabase';

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
            zIndex: 10
          }}
        />
      )}

      {data.src && data.type === 'video' && (
        <video
          src={data.src.startsWith('http') ? data.src : SUPABASE_STORAGE_URL + 'site_content/' + data.src}
          style={{
            filter: data.filter || 'none',
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
      )}
      {data.src && data.type === 'image' && (
        <img
          src={data.src.startsWith('http') ? data.src : SUPABASE_STORAGE_URL + 'site_content/' + data.src}
          style={{
            filter: data.filter || 'none',
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

const FeaturedCollection = ({ content = {} }) => {
  const containerRef = useRef();
  
  const rawSlides = content.slides || [];
  
  const mobileSlides = useMemo(() => {
    return rawSlides.flatMap((slide, i) => [
      { ...slide.left, id: `slide-${i}-L`, zIndex: i * 2 + 1 },
      { ...slide.right, id: `slide-${i}-R`, zIndex: i * 2 + 2 }
    ]);
  }, [rawSlides]);

  const desktopSlides = useMemo(() => {
    return rawSlides.map((slide, i) => ({
      ...slide,
      id: `slide-${i}`,
      zIndex: i + 1
    }));
  }, [rawSlides]);

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const handler = (e) => {
      setIsMobile(e.matches);
    };
    mql.addEventListener('change', handler);
    
    // Fallback resize listener to ensure ScrollTrigger stays accurate
    let resizeTimer;
    const resizeHandler = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };
    window.addEventListener('resize', resizeHandler);
    window.addEventListener('orientationchange', resizeHandler);
    
    return () => {
      mql.removeEventListener('change', handler);
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('orientationchange', resizeHandler);
      clearTimeout(resizeTimer);
    };
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

    // Force ScrollTrigger to recalculate after React finishes injecting the new DOM structure
    const stTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(stTimer);
  }, { scope: containerRef, dependencies: [isMobile] });

  return (
    <section ref={containerRef} id="collections" className="gallery-container">

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
