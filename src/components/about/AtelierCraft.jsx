import React from 'react';
import Lottie from 'lottie-react';
import structureAnimation from '../../assets/lottie/Line Art 3D updated.json';
import atelierProcessImg from '../../assets/atelier-process.png';

const LottieComponent = Lottie.default || Lottie;

const AtelierCraft = () => {
  return (
    <section className="atelier-craft-section">
      <div className="craft-grid">
        
        <div className="craft-content">
          <h2>The Atelier & The Craft</h2>
          <p>
            True luxury cannot be mass-produced. Inside the Amaeti Atelier, each garment is meticulously drafted, cut, and assembled by master artisans. We treat fabric as a sculptural medium, manipulating drape and tension to achieve structural perfection.
          </p>
          <p>
            Sourced exclusively from sustainable mills in Italy and Japan, our raw materials dictate the form of the final piece. The craft is in the patience; we spend hundreds of hours iterating on a single seam to ensure it rests flawlessly against the body.
          </p>
        </div>

        <div className="craft-img-stack">
          <div className="craft-img-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-light)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <LottieComponent animationData={structureAnimation} loop={true} style={{ width: '80%', height: '80%' }} />
          </div>
          <img 
            src={atelierProcessImg} 
            alt="Tailoring Process" 
            className="craft-img-offset"
            style={{ filter: 'grayscale(0.3) contrast(1.1)' }}
          />
        </div>

      </div>
    </section>
  );
};

export default AtelierCraft;
