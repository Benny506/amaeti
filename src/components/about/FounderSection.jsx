import React from 'react';
import Lottie from 'lottie-react';
import founderAnimation from '../../assets/lottie/Female 01.json';
import { SUPABASE_STORAGE_URL } from '../../supabase';

const LottieComponent = Lottie.default || Lottie;

const FounderSection = ({ content = {} }) => {
  return (
    <section className="founder-section">
      <div className="founder-grid">
        <div className="founder-img-wrapper">
          {content.image_src && (
            <img
              src={content.image_src.startsWith('http') ? content.image_src : SUPABASE_STORAGE_URL + 'site_content/' + content.image_src}
              alt="Founder Portrait"
              className="founder-img"
              style={{ filter: 'grayscale(1)' }}
            />
          )}
        </div>
        <div className="founder-content">
          <h2 className="founder-quote">
            {content.quote}
          </h2>
          <div className="founder-bio">
            {(content.bio_paragraphs || []).map((paragraph, idx) => (
              <p key={idx} style={{ marginTop: idx > 0 ? '20px' : '0' }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Lottie Animation */}
          <div className="lottie-container lottie-signature-container" style={{ border: 'none', background: 'transparent', height: '180px', width: '300px' }}>
            <LottieComponent animationData={founderAnimation} loop={true} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
