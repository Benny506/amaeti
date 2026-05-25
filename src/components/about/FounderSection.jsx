import React from 'react';
import Lottie from 'lottie-react';
import founderAnimation from '../../assets/lottie/Female 01.json';

const LottieComponent = Lottie.default || Lottie;

const FounderSection = () => {
  return (
    <section className="founder-section">
      <div className="founder-grid">
        <div className="founder-img-wrapper">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
            alt="Founder Portrait"
            className="founder-img"
            style={{ filter: 'grayscale(1)' }}
          />
        </div>
        <div className="founder-content">
          <h2 className="founder-quote">
            "Clothing should not speak for you. It should provide the silence necessary for you to be heard."
          </h2>
          <div className="founder-bio">
            <p>
              Founded on the principles of architectural minimalism, Amaeti was born from a desire to strip away the superfluous. We believe in the power of negative space—both in design and in life.
            </p>
            <p style={{ marginTop: '20px' }}>
              Our garments are constructed not merely as fabrics draped over the body, but as engineered structures that move, breathe, and live with the wearer. Every seam, every cut is deliberate.
            </p>
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
