import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const AccessDenied = () => {
  return (
    <div style={{
      height: 'calc(100vh - 80px)', // Account for header
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#fff'
    }}>
      <Lock size={64} color="#000" style={{ marginBottom: '24px' }} />
      <h1 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '42px', marginBottom: '16px' }}>
        Access Denied
      </h1>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', color: '#666', marginBottom: '40px', maxWidth: '400px' }}>
        You need to be logged in to view this page. Please sign in to your account or continue exploring our collections.
      </p>
      
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link 
          to="/login" 
          style={{
            padding: '14px 32px',
            backgroundColor: '#000',
            color: '#fff',
            textDecoration: 'none',
            fontFamily: 'var(--font-sans)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontSize: '13px',
            transition: 'background 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#333'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#000'}
        >
          Sign In
        </Link>
        <Link 
          to="/products" 
          style={{
            padding: '14px 32px',
            backgroundColor: '#fff',
            color: '#000',
            textDecoration: 'none',
            fontFamily: 'var(--font-sans)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontSize: '13px',
            border: '1px solid #000',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => { e.target.style.backgroundColor = '#000'; e.target.style.color = '#fff'; }}
          onMouseOut={(e) => { e.target.style.backgroundColor = '#fff'; e.target.style.color = '#000'; }}
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
