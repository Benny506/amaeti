import React, { useEffect } from 'react';
import ContactHero from '../components/contact/ContactHero';
import ContactForm from '../components/contact/ContactForm';
import FaqAccordion from '../components/contact/FaqAccordion';
import AtelierCraft from '../components/about/AtelierCraft';

const Contact = () => {
  return (
    <main style={{ backgroundColor: 'var(--color-bg-cream)', minHeight: '100vh' }}>
      <ContactHero />
      <ContactForm />
      <FaqAccordion />
      <AtelierCraft />
    </main>
  );
};

export default Contact;
