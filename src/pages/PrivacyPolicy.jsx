import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllContent } from '../store/contentSlice';
import { showSubtleLoader, hideSubtleLoader, addToast } from '../store/uiSlice';

const defaultPrivacyContent = {
  title: "Privacy Policy",
  last_updated: "Last Updated: October 2026",
  sections: [
    {
      title: "1. Introduction",
      paragraphs: [
        "Welcome to Amaeti. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.",
        "Amaeti is the controller and responsible for your personal data (collectively referred to as \"Amaeti\", \"we\", \"us\" or \"our\" in this privacy policy)."
      ],
      list: []
    },
    {
      title: "2. Data We Collect",
      paragraphs: [
        "We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:"
      ],
      list: [
        "Identity Data includes first name, maiden name, last name, username or similar identifier.",
        "Contact Data includes billing address, delivery address, email address and telephone numbers.",
        "Financial Data includes bank account and payment card details.",
        "Transaction Data includes details about payments to and from you and other details of products and services you have purchased from us.",
        "Technical Data includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location."
      ]
    },
    {
      title: "3. How We Use Your Data",
      paragraphs: [
        "We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:"
      ],
      list: [
        "Where we need to perform the contract we are about to enter into or have entered into with you.",
        "Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.",
        "Where we need to comply with a legal obligation."
      ]
    },
    {
      title: "4. Data Security",
      paragraphs: [
        "We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know."
      ],
      list: []
    },
    {
      title: "5. Your Legal Rights",
      paragraphs: [
        "Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent."
      ],
      list: []
    }
  ]
};

const PrivacyPolicy = () => {
  const dispatch = useDispatch();
  const { pages, loading } = useSelector((state) => state.content);
  
  const content = pages['privacy-policy'];

  useEffect(() => {
    if (Object.keys(pages).length === 0 && !loading.global) {
      dispatch(showSubtleLoader('Fetching latest policies...'));
      dispatch(fetchAllContent())
        .unwrap()
        .then(() => dispatch(hideSubtleLoader()))
        .catch(() => {
          dispatch(hideSubtleLoader());
          dispatch(addToast({ type: 'error', message: 'Failed to load live policies. Using defaults.' }));
        });
    }
  }, [dispatch, pages, loading.global]);

  const displayContent = content || defaultPrivacyContent;

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

export default PrivacyPolicy;
