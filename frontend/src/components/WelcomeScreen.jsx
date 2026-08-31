import React, { useState } from 'react';

export default function WelcomeScreen({ onEnterDashboard }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnterDashboard();
    }, 1000); // 1s slow fade/dissolve
  };

  return (
    <>
      <style>{`
        @keyframes ambientFloat {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-6px) scale(1.002); }
          100% { transform: translateY(0px) scale(1); }
        }
        .welcome-box {
          animation: ambientFloat 6s ease-in-out infinite;
        }
      `}</style>

      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#FAFAFA',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        color: '#111',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden',
        opacity: isExiting ? 0 : 1,
        filter: isExiting ? 'blur(10px)' : 'blur(0px)',
        transform: isExiting ? 'scale(1.03)' : 'scale(1)',
        transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>

        <div className="welcome-box" style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: '700px',
          padding: '60px 50px',
          border: '1px solid #111',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ 
            fontSize: '0.75rem', 
            fontWeight: '700', 
            letterSpacing: '4px', 
            color: '#666', 
            marginBottom: '20px',
            textTransform: 'uppercase'
          }}>
            LORDGOD1 Intelligence Studio
          </div>

          <h1 style={{ 
            fontSize: '4.5rem', 
            margin: '0 0 15px 0', 
            fontWeight: '900', 
            color: '#111', 
            letterSpacing: '-2px',
            textTransform: 'uppercase'
          }}>
            WayWatch
          </h1>

          <p style={{ 
            color: '#555', 
            fontSize: '1rem', 
            lineHeight: '1.7', 
            marginBottom: '40px',
            fontWeight: '400'
          }}>
            Precision path deviation telemetry and turn sequence anomaly mapping. Designed for structural minimalism and uncompromising performance. Lessgo!
          </p>

          <button
            onClick={handleEnter}
            style={{
              padding: '18px 45px',
              backgroundColor: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: '0px',
              fontSize: '0.9rem',
              fontWeight: '700',
              letterSpacing: '2px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease, transform 0.2s ease',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#111'}
          >
            Enter System →
          </button>

          <div style={{ marginTop: '35px', fontSize: '0.7rem', color: '#888', letterSpacing: '1px' }}>
            ED. 2026 / SECURE TELEMETRY TYPESHI
          </div>
        </div>
      </div>
    </>
  );
}