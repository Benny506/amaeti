import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../../supabase';
import { adminCredentials } from '../../adminCredentials';
import { showBlockingLoader, hideBlockingLoader, addToast } from '../../store/uiSlice';

const ContactForm = ({ content = {} }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    dispatch(showBlockingLoader('Sending your inquiry...'));

    const htmlTemplate = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #fdfbf7; color: #1a1a1a;">
        <div style="text-align: center; margin-bottom: 40px;">
          <img src="${adminCredentials.logo_url}" alt="Amaeti Logo" style="height: 40px; filter: brightness(0);" />
        </div>
        <div style="background-color: #ffffff; padding: 40px; border: 1px solid #eaeaea;">
          <h2 style="margin-top: 0; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; font-size: 14px; border-bottom: 1px solid #eaeaea; padding-bottom: 20px;">New Atelier Inquiry</h2>
          <p style="font-size: 14px; margin-bottom: 10px;"><strong>Name:</strong> ${formData.name}</p>
          <p style="font-size: 14px; margin-bottom: 10px;"><strong>Email:</strong> ${formData.email}</p>
          <p style="font-size: 14px; margin-bottom: 10px;"><strong>Subject:</strong> ${formData.subject}</p>
          <div style="margin-top: 30px;">
            <p style="font-weight: 600; font-size: 14px;">Message:</p>
            <p style="white-space: pre-wrap; line-height: 1.8; color: #4a4a4a; font-size: 14px;">${formData.message}</p>
          </div>
        </div>
        <div style="text-align: center; margin-top: 30px; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px;">
          <p>This is an automated message from <a href="${adminCredentials.platform_url}" style="color: #1a1a1a;">amaeti.com</a></p>
        </div>
      </div>
    `;

    const config = {
      from: { email: adminCredentials.from_email, name: adminCredentials.from_name },
      to: [{ email: adminCredentials.admin_email, name: "Admin" }],
      subject: `New Inquiry: ${formData.subject}`,
      html: htmlTemplate
    };

    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { config }
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
