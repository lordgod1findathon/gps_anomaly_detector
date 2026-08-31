import React from 'react';

export default function WelcomeScreen({ onEnterDashboard }) {
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
      overflow: 'hidden'
    }}>

      {/* Content Box */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        maxWidth: '650px',
        padding: '50px 40px',
        border: '1px solid #E5DFD3',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 20px 40px rgba(122, 32, 33, 0.08)',
        borderRadius: '20px'
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
          Fleet Intelligence Platform
        </div>

        <h1 style={{ 
          fontSize: '3rem', 
          margin: '0 0 15px 0', 
          fontWeight: '900', 
          color: '#7A2021', 
          letterSpacing: '-0.5px'
        }}>
          FleetIntel Ops
        </h1>

        <p style={{ 
          color: '#6B655E', 
          fontSize: '1.05rem', 
          lineHeight: '1.6', 
          marginBottom: '35px' 
        }}>
          Deploy real-time GPS telemetry anomaly detection. Monitor route deviations, analyze turn geometry vectors, and secure logistics operations with precision.
        </p>

        {/* Play / Initialize Button matching your theme */}
        <button
          onClick={onEnterDashboard}
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
          Initialize Dashboard →
        </button>

        <div style={{ marginTop: '30px', fontSize: '0.8rem', color: '#999' }}>
          Interactive Map Telemetry / Spatial Baseline Analysis
        </div>
      </div>
    </div>
  );
}