import React, { useState } from 'react';

const faqs = [
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship globally via express courier services. All shipments are fully insured. Please note that customs duties and taxes are the responsibility of the recipient."
  },
  {
    question: "How does the bespoke sizing process work?",
    answer: "For our bespoke pieces, you will be invited for a virtual or in-person consultation at our atelier. We take over 20 unique measurements to ensure the garment drapes flawlessly according to your body's architecture."
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns on unworn, standard-size garments within 14 days of delivery. Due to their nature, bespoke and made-to-measure pieces are final sale."
  },
  {
    question: "How should I care for my Amaeti garments?",
    answer: "Our pieces are crafted from delicate, natural fibers. We strongly recommend professional dry cleaning only. Never machine wash or tumble dry your garments, as this will compromise their structural integrity."
  }
];

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <h2 style={{ fontFamily: 'var(--font-serif-display)', fontSize: 'clamp(2rem, 4vw, 2.5rem)', color: 'var(--color-text-dark)' }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                <span>{faq.question}</span>
                <span className={`faq-icon ${openIndex === index ? 'open' : ''}`}>+</span>
              </div>
              <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqAccordion;
