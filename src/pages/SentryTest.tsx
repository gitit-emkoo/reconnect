import React from 'react';

const SentryTest: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Sentry 테스트 페이지</h1>
      <button 
        onClick={() => {
          throw new Error("This is your first error!");
        }}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Break the world
      </button>
    </div>
  );
};

export default SentryTest; 