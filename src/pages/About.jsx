import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllContent } from '../store/contentSlice';
import { showSubtleLoader, hideSubtleLoader, addToast } from '../store/uiSlice';

import AboutHero from '../components/about/AboutHero';
import FounderSection from '../components/about/FounderSection';
import MissionVision from '../components/about/MissionVision';
import CoreValues from '../components/about/CoreValues';
import AtelierCraft from '../components/about/AtelierCraft';

const defaultAboutContent = {
  about_hero: {
    title: "The Architecture of Elegance",
    subtitle: "Form • Fabric • Future",
  },
  founder_section: {
    quote: "\"Clothing should not speak for you. It should provide the silence necessary for you to be heard.\"",
    bio_paragraphs: [
      "Founded on the principles of architectural minimalism, Amaeti was born from a desire to strip away the superfluous. We believe in the power of negative space—both in design and in life.",
      "Our garments are constructed not merely as fabrics draped over the body, but as engineered structures that move, breathe, and live with the wearer. Every seam, every cut is deliberate."
    ]
  },
  mission_vision: {
    mission_title: "Our Mission",
    mission_text: "To redefine modern luxury by creating timeless, sculptural garments that empower the wearer through minimalist design and uncompromising quality. We strip away the excess to reveal the essential.",
    vision_title: "Our Vision",
    vision_text: "To build a globally recognized house of design where fashion is treated as wearable architecture. A future where sustainability and aesthetic perfection exist in complete harmony."
  },
  core_values: {
    title: "The Pillars",
    values: [
      { id: 1, title: 'Precision', desc: 'Every cut is calculated. We leave no room for the superfluous, focusing solely on flawless execution.' },
      { id: 2, title: 'Heritage', desc: 'Rooted in classic tailoring, we honor traditional craftsmanship while engineering it for the modern era.' },
      { id: 3, title: 'Continuity', desc: 'An unbroken thread of intention. We design fluid pieces that move effortlessly, transcending temporary trends and seasons.' },
      { id: 4, title: 'Structure', desc: 'The power of geometry in motion. We engineer our garments with mathematical precision to achieve flawless silhouettes.' }
    ]
  },
  atelier_craft: {
    title: "The Atelier & The Craft",
    paragraphs: [
      "True luxury cannot be mass-produced. Inside the Amaeti Atelier, each garment is meticulously drafted, cut, and assembled by master artisans. We treat fabric as a sculptural medium, manipulating drape and tension to achieve structural perfection.",
      "Sourced exclusively from sustainable mills in Italy and Japan, our raw materials dictate the form of the final piece. The craft is in the patience; we spend hundreds of hours iterating on a single seam to ensure it rests flawlessly against the body."
    ]
  }
};

const About = () => {
  const dispatch = useDispatch();
  const { pages, loading } = useSelector((state) => state.content);
  const content = pages.about;

  useEffect(() => {
    // If we don't have the content in redux yet, fetch it
    if (Object.keys(pages).length === 0 && !loading.global) {
      dispatch(showSubtleLoader('Fetching latest collection...'));
      dispatch(fetchAllContent())
        .unwrap()
        .then(() => {
          dispatch(hideSubtleLoader());
        })
        .catch((err) => {
          dispatch(hideSubtleLoader());
          dispatch(addToast({ type: 'error', message: 'Failed to load live content. Using defaults.' }));
        });
    }
  }, [dispatch, pages, loading.global]);

  const displayContent = content || defaultAboutContent;

  return (
    <main style={{ backgroundColor: 'var(--color-bg-cream)', minHeight: '100vh' }}>
      <AboutHero content={displayContent.about_hero || {}} />
      <FounderSection content={displayContent.founder_section || {}} />
      <MissionVision content={displayContent.mission_vision || {}} />
      <CoreValues content={displayContent.core_values || {}} />
      <AtelierCraft content={displayContent.atelier_craft || {}} />
    </main>
  );
};

export default About;
