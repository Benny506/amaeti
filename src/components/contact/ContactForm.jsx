import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase, invokeEdgeFunction } from '../../supabase';
import { showBlockingLoader, hideBlockingLoader, addToast } from '../../store/uiSlice';

const ContactForm = ({ content = {} }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    dispatch(showBlockingLoader('Sending your inquiry...'));

    try {
      const { data, error } = await invokeEdgeFunction('send-email', {
        action: "send_contact_inquiry",
        email: formData.email,
        payload: {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        }
      });

      if (error) throw error;

      dispatch(hideBlockingLoader());
      dispatch(addToast({ type: 'success', message: 'Your inquiry has been successfully sent to the Atelier.' }));
      setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
    } catch (err) {
      console.error('Error sending email:', err);
      dispatch(hideBlockingLoader());
      dispatch(addToast({ type: 'error', message: 'There was an issue sending your inquiry. Please try again.' }));
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-grid">
        
        {/* Left Side: Contact Details */}
        <div className="contact-details">
          {(content.blocks || []).map((block, idx) => (
            <div key={idx} className="contact-block">
              <h3>{block.title}</h3>
              <p>{block.text}</p>
            </div>
          ))}
          <div className="contact-block" style={{ marginTop: '20px' }}>
            <p 
              style={{ fontSize: '16px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)', lineHeight: '1.8' }}
              dangerouslySetInnerHTML={{ __html: content.footer_text || '' }}
            />
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
