import React from 'react';
import HeroCarousel from '../components/home/HeroCarousel';
import ShowcaseSection from '../components/home/ShowcaseSection';
import AtelierSection from '../components/home/AtelierSection';
import FeaturedCollection from '../components/home/FeaturedCollection';
import PhilosophyBanner from '../components/home/PhilosophyBanner';

const Home = () => {
  return (
    <main>
      <HeroCarousel />
      <AtelierSection />
      <ShowcaseSection />
      <FeaturedCollection />
      <PhilosophyBanner />
    </main>
  );
};

export default Home;
