import React from 'react';
import Lottie from 'lottie-react';
import missionAnimation from '../../assets/lottie/Mission.json';
import visionAnimation from '../../assets/lottie/Vision Eye.json';

const LottieComponent = Lottie.default || Lottie;

const MissionVision = () => {
  return (
    <section className="mission-vision-section">
      <div className="mv-container">
        
        {/* Mission Box */}
        <div className="mv-box">
          <div className="lottie-container lottie-graphic-container" style={{ background: 'transparent', border: 'none' }}>
            <LottieComponent animationData={missionAnimation} loop={true} style={{ height: '100%', width: '100%' }} />
          </div>
          <h2>Our Mission</h2>
          <p>
            To redefine modern luxury by creating timeless, sculptural garments that empower the wearer through minimalist design and uncompromising quality. We strip away the excess to reveal the essential.
          </p>
        </div>

        {/* Vision Box */}
        <div className="mv-box" style={{ transform: 'translateY(40px)' }}>
          <div className="lottie-container lottie-graphic-container" style={{ background: 'transparent', border: 'none' }}>
            <LottieComponent animationData={visionAnimation} loop={true} style={{ height: '100%', width: '100%' }} />
          </div>
          <h2>Our Vision</h2>
          <p>
            To build a globally recognized house of design where fashion is treated as wearable architecture. A future where sustainability and aesthetic perfection exist in complete harmony.
          </p>
        </div>

      </div>
    </section>
  );
};

export default MissionVision;
