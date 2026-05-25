import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Submit logic goes here
  };

  return (
    <section className="contact-section">
      <div className="contact-grid">
        
        {/* Left Side: Contact Details */}
        <div className="contact-details">
          <div className="contact-block">
            <h3>Concierge & Bespoke</h3>
            <p>atelier@amaeti.com</p>
          </div>
          <div className="contact-block">
            <h3>Press & Partnerships</h3>
            <p>press@amaeti.com</p>
          </div>
          <div className="contact-block">
            <h3>Atelier Contact</h3>
            <p>+33 (0) 1 40 20 50 00</p>
          </div>
          <div className="contact-block" style={{ marginTop: '20px' }}>
            <p style={{ fontSize: '16px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)', lineHeight: '1.8' }}>
              Our dedicated client advisors are available Monday through Saturday,<br/>
              from 9:00 AM to 8:00 PM CET.
            </p>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <form className="luxe-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="text" 
              name="name" 
              className="luxe-input" 
              placeholder="Name" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input 
              type="email" 
              name="email" 
              className="luxe-input" 
              placeholder="Email" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input 
              type="text" 
              name="subject" 
              className="luxe-input" 
              placeholder="Subject" 
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <textarea 
              name="message" 
              className="luxe-input" 
              placeholder="Message" 
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="luxe-submit">Send Inquiry</button>
        </form>

      </div>
    </section>
  );
};

export default ContactForm;
