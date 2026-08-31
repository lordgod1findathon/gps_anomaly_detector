import React, { useState } from 'react';

export default function WelcomeScreen({ onEnterDashboard }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = () => {
    setIsExiting(true);
    // Wait for the apple-style zoom transition animation to finish before unmounting
    setTimeout(() => {
      onEnterDashboard();
    }, 800);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#F9F5F0',
      backgroundImage: 'radial-gradient(circle at center, #E5DFD3 0%, #F9F5F0 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      color: '#333',
      fontFamily: 'sans-serif',
      overflow: 'hidden',
      // Apple-style zoom and fade out effect
      transform: isExiting ? 'scale(1.08)' : 'scale(1)',
      opacity: isExiting ? 0 : 1,
      transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>

      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        maxWidth: '650px',
        padding: '50px 40px',
        border: '1px solid #E5DFD3',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 20px 40px rgba(122, 32, 33, 0.08)',
        borderRadius: '20px',
        transform: isExiting ? 'scale(0.95)' : 'scale(1)',
        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{ 
          display: 'inline-block',
          backgroundColor: '#EFE5D8',
          color: '#7A2021',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          letterSpacing: '1.5px',
          marginBottom: '20px',
          textTransform: 'uppercase'
        }}>
          Spatial Telemetry Intelligence
        </div>

        <h1 style={{ 
          fontSize: '3.5rem', 
          margin: '0 0 15px 0', 
          fontWeight: '900', 
          color: '#7A2021', 
          letterSpacing: '-1px'
        }}>
          WayWatch
        </h1>

        <p style={{ 
          color: '#6B655E', 
          fontSize: '1.05rem', 
          lineHeight: '1.6', 
          marginBottom: '35px' 
        }}>
          Unbothered monitoring. Real-time path deviation tracking, vector geometry checks, and zero noise anomaly detection.
        </p>

        <button
          onClick={handleEnter}
          style={{
            padding: '16px 45px',
            backgroundColor: '#1E3F2B',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            letterSpacing: '1px',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(30, 63, 43, 0.3)',
            transition: 'all 0.2s ease',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
        >
          Enter Dashboard →
        </button>

        <div style={{ marginTop: '30px', fontSize: '0.8rem', color: '#999' }}>
          Waywatch Systems / Status: Nominal
        </div>
      </div>
    </div>
  );
}