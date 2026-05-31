import React from 'react';
import { SUPABASE_STORAGE_URL } from '../../supabase';

const ContactHero = ({ content = {} }) => {
  return (
    <section className="contact-hero">
      {content.background_image_src && (
        <img 
          src={content.background_image_src.startsWith('http') ? content.background_image_src : SUPABASE_STORAGE_URL + 'site_content/' + content.background_image_src} 
          alt="Get in Touch" 
          className="contact-hero-bg"
        />
      )}
      <h1 className="contact-hero-title">{content.title}</h1>
    </section>
  );
};

export default ContactHero;
