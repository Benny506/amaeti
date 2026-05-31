import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllContent } from '../store/contentSlice';
import { showSubtleLoader, hideSubtleLoader, addToast } from '../store/uiSlice';

import ContactHero from '../components/contact/ContactHero';
import ContactForm from '../components/contact/ContactForm';
import FaqAccordion from '../components/contact/FaqAccordion';
import AtelierCraft from '../components/about/AtelierCraft';

const defaultContactContent = {
  contact_hero: {
    title: "Get In Touch",
  },
  contact_details: {
    blocks: [
      { title: "Concierge & Bespoke", text: "atelier@amaeti.com" },
      { title: "Press & Partnerships", text: "press@amaeti.com" },
      { title: "Atelier Contact", text: "+33 (0) 1 40 20 50 00" }
    ],
    footer_text: "Our dedicated client advisors are available Monday through Saturday,<br/>from 9:00 AM to 8:00 PM CET."
  },
  faqs: {
    title: "Frequently Asked Questions",
    items: [
      { question: "Do you offer international shipping?", answer: "Yes, we ship globally via express courier services. All shipments are fully insured. Please note that customs duties and taxes are the responsibility of the recipient." },
      { question: "How does the bespoke sizing process work?", answer: "For our bespoke pieces, you will be invited for a virtual or in-person consultation at our atelier. We take over 20 unique measurements to ensure the garment drapes flawlessly according to your body's architecture." },
      { question: "What is your return policy?", answer: "We accept returns on unworn, standard-size garments within 14 days of delivery. Due to their nature, bespoke and made-to-measure pieces are final sale." },
      { question: "How should I care for my Amaeti garments?", answer: "Our pieces are crafted from delicate, natural fibers. We strongly recommend professional dry cleaning only. Never machine wash or tumble dry your garments, as this will compromise their structural integrity." }
    ]
  }
};

const Contact = () => {
  const dispatch = useDispatch();
  const { pages, loading } = useSelector((state) => state.content);
  
  const content = pages.contact;
  const aboutContent = pages.about; // To feed AtelierCraft

  useEffect(() => {
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

  const displayContent = content || defaultContactContent;
  const atelierCraftContent = aboutContent ? aboutContent.atelier_craft : {};

  return (
    <main style={{ backgroundColor: 'var(--color-bg-cream)', minHeight: '100vh' }}>
      <ContactHero content={displayContent.contact_hero || {}} />
      <ContactForm content={displayContent.contact_details || {}} />
      <FaqAccordion content={displayContent.faqs || {}} />
      <AtelierCraft content={atelierCraftContent} />
    </main>
  );
};

export default Contact;
