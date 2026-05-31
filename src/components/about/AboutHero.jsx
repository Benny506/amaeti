import React from 'react';
import { SUPABASE_STORAGE_URL } from '../../supabase';

const AboutHero = ({ content = {} }) => {
  return (
    <section className="about-hero">
      {content.background_image_src && (
        <img 
          src={content.background_image_src.startsWith('http') ? content.background_image_src : SUPABASE_STORAGE_URL + 'site_content/' + content.background_image_src} 
          alt={content.title} 
          className="about-hero-bg"
        />
      )}
      <div className="about-hero-content">
        <h1 className="about-hero-title">{content.title}</h1>
        <p style={{ letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '14px' }}>
          {content.subtitle}
        </p>
      </div>
    </section>
  );
};

export default AboutHero;
