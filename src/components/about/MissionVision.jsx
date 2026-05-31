import React from 'react';
import Lottie from 'lottie-react';
import missionAnimation from '../../assets/lottie/Mission.json';
import visionAnimation from '../../assets/lottie/Vision Eye.json';

const LottieComponent = Lottie.default || Lottie;

const MissionVision = ({ content = {} }) => {
  return (
    <section className="mission-vision-section">
      <div className="mv-container">
        
        {/* Mission Box */}
        <div className="mv-box">
          <div className="lottie-container lottie-graphic-container" style={{ background: 'transparent', border: 'none' }}>
            <LottieComponent animationData={missionAnimation} loop={true} style={{ height: '100%', width: '100%' }} />
          </div>
          <h2>{content.mission_title}</h2>
          <p>
            {content.mission_text}
          </p>
        </div>

        {/* Vision Box */}
        <div className="mv-box" style={{ transform: 'translateY(40px)' }}>
          <div className="lottie-container lottie-graphic-container" style={{ background: 'transparent', border: 'none' }}>
            <LottieComponent animationData={visionAnimation} loop={true} style={{ height: '100%', width: '100%' }} />
          </div>
          <h2>{content.vision_title}</h2>
          <p>
            {content.vision_text}
          </p>
        </div>

      </div>
    </section>
  );
};

export default MissionVision;
