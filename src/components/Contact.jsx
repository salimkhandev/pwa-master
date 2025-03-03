import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


const Contact = () => {

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log('Form submitted');
  };

  return (
    <div className="fade-in">
      <header className="text-center mb-12">
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 700,
          marginBottom: '1rem',
          fontFamily: 'Montserrat, sans-serif'
        }}>
          Contact Us please
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#64748b',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Get in touch with us. We'd love to hear from you.
        </p>
      </header>

      <div className="card-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Contact Information */}
        <div className="card slide-up">
          <div className="card-content">
            <h3>Contact Information</h3>
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Address:</strong><br />
                123 Web Street<br />
                Digital City, DC 12345
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Email:</strong><br />
                contact@example.com
              </p>
              <p>
                <strong>Phone:</strong><br />
                (555) 123-4567
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-content">
            <h3>Send us a Message</h3>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Your Name"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0',
                    marginBottom: '1rem'
                  }}
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0',
                    marginBottom: '1rem'
                  }}
                  required
                />
                <textarea
                  placeholder="Your Message"
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0',
                    marginBottom: '1rem'
                  }}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'background-color var(--transition-speed)'
                }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 