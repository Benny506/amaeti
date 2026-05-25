import React from 'react';

const AboutHero = () => {
  return (
    <section className="about-hero">
      <img 
        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=80" 
        alt="The Architecture of Elegance" 
        className="about-hero-bg"
      />
      <div className="about-hero-content">
        <h1 className="about-hero-title">The Architecture of Elegance</h1>
        <p style={{ letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '14px' }}>
          Form • Fabric • Future
        </p>
      </div>
    </section>
  );
};

export default AboutHero;
