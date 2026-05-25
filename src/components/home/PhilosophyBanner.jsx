import React from 'react';
import logoMonogram from '../../assets/logo.svg';

const PhilosophyBanner = () => {
  return (
    <section id="philosophy" className="section-padding" style={{
      background: `linear-gradient(rgba(26,26,26,0.9), rgba(26,26,26,0.95)), url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: '#fff',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        <img 
          src={logoMonogram} 
          alt="amaeti monogram" 
          style={{ height: '80px', marginBottom: '30px', filter: 'brightness(0) invert(1) opacity(0.85)' }} 
        />
        <h2 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '38px', letterSpacing: '0.08em', marginBottom: '25px', color: '#fff' }}>
          Abstract Expressionism in Design
        </h2>
        <p style={{ fontFamily: 'var(--font-serif-body)', fontSize: '20px', lineHeight: '1.7', color: '#d0d0d0', fontStyle: 'italic', marginBottom: '40px' }}>
          "We do not create mere garments. We create canvases. We create frames. Sculpted from earth-friendly elements, finished with wood-toned warmth, designed to frame your individuality."
        </p>
        <a href="/#collections" className="luxe-btn" style={{ backgroundColor: 'var(--color-primary)', border: '1px solid var(--color-primary)', color: 'var(--color-text-dark)' }}>
          Discover The Collection
        </a>
      </div>
    </section>
  );
};

export default PhilosophyBanner;
