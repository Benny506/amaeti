import React from 'react';
import Lottie from 'lottie-react';
import structureAnimation from '../../assets/lottie/Line Art 3D updated.json';
import { SUPABASE_STORAGE_URL } from '../../supabase';

const LottieComponent = Lottie.default || Lottie;

const AtelierCraft = ({ content = {} }) => {
  return (
    <section className="atelier-craft-section">
      <div className="craft-grid">
        
        <div className="craft-content">
          <h2>{content.title}</h2>
          {(content.paragraphs || []).map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        <div className="craft-img-stack">
          <div className="craft-img-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-light)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <LottieComponent animationData={structureAnimation} loop={true} style={{ width: '80%', height: '80%' }} />
          </div>
          {content.image_src && (
            <img 
              src={content.image_src.startsWith('http') ? content.image_src : SUPABASE_STORAGE_URL + 'site_content/' + content.image_src} 
              alt="Tailoring Process" 
              className="craft-img-offset"
              style={{ filter: 'grayscale(0.3) contrast(1.1)' }}
            />
          )}
        </div>

      </div>
    </section>
  );
};

export default AtelierCraft;
