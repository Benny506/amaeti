import React from 'react';
import Lottie from 'lottie-react';
import matchAnimation from '../../assets/lottie/match.json';
import heritageAnimation from '../../assets/lottie/Fashionable girl in red dress.json';
import sustainabilityAnimation from '../../assets/lottie/Line art.json';
import tailorPantsAnimation from '../../assets/lottie/Tailor pants.json';

const LottieComponent = Lottie.default || Lottie;

const CoreValues = ({ content = {} }) => {
  const values = content.values || [];

  return (
    <section className="core-values-section">
      <div className="core-values-header">
        <h2 style={{ fontFamily: 'var(--font-serif-display)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: 'var(--color-text-dark)' }}>
          {content.title}
        </h2>
      </div>

      <div className="values-grid">
        {values.map((val, idx) => {
          // Determine which animation to show based on the index
          // 0: match, 1: heritage, 2: sustainability, 3: tailor
          let animationData = null;
          if (idx === 0) animationData = matchAnimation;
          else if (idx === 1) animationData = heritageAnimation;
          else if (idx === 2) animationData = sustainabilityAnimation;
          else if (idx === 3) animationData = tailorPantsAnimation;

          return (
            <div key={val.id || idx} className="value-card">
              <div 
                className="lottie-container animation-plinth" 
                style={(idx >= 0 && idx <= 3) ? { border: 'none', background: 'transparent' } : {}}
              >
                {animationData ? (
                  <LottieComponent animationData={animationData} loop={true} style={{ height: '100%', width: '100%' }} />
                ) : (
                  `[Lottie: ${val.title}]`
                )}
              </div>
              
              <h3 className="value-title">{val.title}</h3>
              <p className="value-desc">{val.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CoreValues;
