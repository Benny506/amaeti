import React from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '../../store/uiSlice';
import logoMonogram from '../../assets/logo.svg';

import { SUPABASE_STORAGE_URL } from '../../supabase';

const PhilosophyBanner = ({ content = {} }) => {
  const dispatch = useDispatch();
  const bgImg = content.background_image_src ? (content.background_image_src.startsWith('http') ? content.background_image_src : SUPABASE_STORAGE_URL + 'site_content/' + content.background_image_src) : '';

  return (
    <section id="philosophy" className="section-padding" style={{
      background: bgImg ? `linear-gradient(rgba(26,26,26,0.9), rgba(26,26,26,0.95)), url('${bgImg}')` : `linear-gradient(rgba(26,26,26,0.9), rgba(26,26,26,0.95))`,
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
          {content.title}
        </h2>
        <p style={{ fontFamily: 'var(--font-serif-body)', fontSize: '20px', lineHeight: '1.7', color: '#d0d0d0', fontStyle: 'italic', marginBottom: '40px' }}>
          {content.quote}
        </p>
        <button 
          onClick={(e) => { e.preventDefault(); dispatch(addToast({ type: 'info', message: 'Coming Soon' })); }}
          className="luxe-btn" 
          style={{ backgroundColor: 'var(--color-primary)', border: '1px solid var(--color-primary)', color: 'var(--color-text-dark)' }}
        >
          {content.button_text}
        </button>
      </div>
    </section>
  );
};

export default PhilosophyBanner;
