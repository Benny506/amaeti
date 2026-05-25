import React from 'react';
import Lottie from 'lottie-react';
import matchAnimation from '../../assets/lottie/match.json';
import heritageAnimation from '../../assets/lottie/Fashionable girl in red dress.json';
import sustainabilityAnimation from '../../assets/lottie/Line art.json';
import tailorPantsAnimation from '../../assets/lottie/Tailor pants.json';

const LottieComponent = Lottie.default || Lottie;

const values = [
  {
    id: 1,
    title: 'Precision',
    desc: 'Every cut is calculated. We leave no room for the superfluous, focusing solely on flawless execution.'
  },
  {
    id: 2,
    title: 'Heritage',
    desc: 'Rooted in classic tailoring, we honor traditional craftsmanship while engineering it for the modern era.'
  },
  {
    id: 3,
    title: 'Continuity',
    desc: 'An unbroken thread of intention. We design fluid pieces that move effortlessly, transcending temporary trends and seasons.'
  },
  {
    id: 4,
    title: 'Structure',
    desc: 'The power of geometry in motion. We engineer our garments with mathematical precision to achieve flawless silhouettes.'
  }
];

const CoreValues = () => {
  return (
    <section className="core-values-section">
      <div className="core-values-header">
        <h2 style={{ fontFamily: 'var(--font-serif-display)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: 'var(--color-text-dark)' }}>
          The Pillars
        </h2>
      </div>

      <div className="values-grid">
        {values.map(val => (
          <div key={val.id} className="value-card">
            <div 
              className="lottie-container animation-plinth" 
              style={(val.title === 'Precision' || val.title === 'Heritage' || val.title === 'Continuity' || val.title === 'Structure') ? { border: 'none', background: 'transparent' } : {}}
            >
              {val.title === 'Precision' ? (
                <LottieComponent animationData={matchAnimation} loop={true} style={{ height: '100%', width: '100%' }} />
              ) : val.title === 'Heritage' ? (
                <LottieComponent animationData={heritageAnimation} loop={true} style={{ height: '100%', width: '100%' }} />
              ) : val.title === 'Continuity' ? (
                <LottieComponent animationData={sustainabilityAnimation} loop={true} style={{ height: '100%', width: '100%' }} />
              ) : val.title === 'Structure' ? (
                <LottieComponent animationData={tailorPantsAnimation} loop={true} style={{ height: '100%', width: '100%' }} />
              ) : (
                `[Lottie: ${val.title}]`
              )}
            </div>
            
            <h3 className="value-title">{val.title}</h3>
            <p className="value-desc">{val.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoreValues;
