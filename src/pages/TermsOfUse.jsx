import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllContent } from '../store/contentSlice';
import { showSubtleLoader, hideSubtleLoader, addToast } from '../store/uiSlice';

const defaultTermsContent = {
  title: "Terms of Use",
  last_updated: "Last Updated: October 2026",
  sections: [
    {
      title: "1. Agreement to Terms",
      paragraphs: [
        "These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity (\"you\") and Amaeti (\"we\", \"us\", or \"our\"), concerning your access to and use of the amaeti.com website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.",
        "You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms of Use. If you do not agree with all of these Terms of Use, then you are expressly prohibited from using the Site and you must discontinue use immediately."
      ],
      list: []
    },
    {
      title: "2. Intellectual Property Rights",
      paragraphs: [
        "Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the \"Content\") and the trademarks, service marks, and logos contained therein (the \"Marks\") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights.",
        "The Content and the Marks are provided on the Site \"AS IS\" for your information and personal use only. Except as expressly provided in these Terms of Use, no part of the Site and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever."
      ],
      list: []
    },
    {
      title: "3. User Representations",
      paragraphs: [
        "By using the Site, you represent and warrant that:"
      ],
      list: [
        "All registration information you submit will be true, accurate, current, and complete.",
        "You will maintain the accuracy of such information and promptly update such registration information as necessary.",
        "You have the legal capacity and you agree to comply with these Terms of Use.",
        "You are not a minor in the jurisdiction in which you reside.",
        "You will not access the Site through automated or non-human means, whether through a bot, script or otherwise."
      ]
    },
    {
      title: "4. Products and Services",
      paragraphs: [
        "We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products."
      ],
      list: []
    }
  ]
};

const TermsOfUse = () => {
  const dispatch = useDispatch();
  const { pages, loading } = useSelector((state) => state.content);
  
  const content = pages['terms-of-use'];

  useEffect(() => {
    if (Object.keys(pages).length === 0 && !loading.global) {
      dispatch(showSubtleLoader('Fetching latest terms...'));
      dispatch(fetchAllContent())
        .unwrap()
        .then(() => dispatch(hideSubtleLoader()))
        .catch(() => {
          dispatch(hideSubtleLoader());
          dispatch(addToast({ type: 'error', message: 'Failed to load live terms. Using defaults.' }));
        });
    }
  }, [dispatch, pages, loading.global]);

  const displayContent = content || defaultTermsContent;

  return (
    <main style={{ backgroundColor: 'var(--color-bg-cream)', minHeight: '100vh', paddingTop: '160px', paddingBottom: '100px', color: 'var(--color-text-dark)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem' }}>
          {displayContent.title}
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: '4rem' }}>
          {displayContent.last_updated}
        </p>

        {(displayContent.sections || []).map((section, idx) => (
          <section key={idx} style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '2rem', marginBottom: '1.5rem' }}>{section.title}</h2>
            
            {(section.paragraphs || []).map((para, pIdx) => (
              <p key={pIdx} style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', lineHeight: '1.8', color: 'var(--color-text-muted)', marginBottom: pIdx === section.paragraphs.length - 1 && (!section.list || section.list.length === 0) ? '0' : '1.5rem' }}>
                {para}
              </p>
            ))}

            {section.list && section.list.length > 0 && (
              <ul style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', lineHeight: '1.8', color: 'var(--color-text-muted)', paddingLeft: '20px' }}>
                {section.list.map((item, lIdx) => (
                  <li key={lIdx} style={{ marginBottom: '0.5rem' }}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </main>
  );
};

export default TermsOfUse;
