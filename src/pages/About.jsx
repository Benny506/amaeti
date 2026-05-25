import React, { useEffect } from 'react';
import AboutHero from '../components/about/AboutHero';
import FounderSection from '../components/about/FounderSection';
import MissionVision from '../components/about/MissionVision';
import CoreValues from '../components/about/CoreValues';
import AtelierCraft from '../components/about/AtelierCraft';

const About = () => {
  return (
    <main style={{ backgroundColor: 'var(--color-bg-cream)', minHeight: '100vh' }}>
      <AboutHero />
      <FounderSection />
      <MissionVision />
      <CoreValues />
      <AtelierCraft />
    </main>
  );
};

export default About;
