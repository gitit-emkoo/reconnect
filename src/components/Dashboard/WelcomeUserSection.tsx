import React from 'react';

interface WelcomeUserSectionProps {
  user: { nickname: string };
  heartPercent: number;
  emotion: string;
}

const WelcomeUserSection: React.FC<WelcomeUserSectionProps> = ({ user, heartPercent, emotion }) => (
  <div>
    <div style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 8 }}>
      {user.nickname}님, 감정을 챙깁니다다
    </div>
    <div style={{ color: '#888', fontSize: '1.1rem' }}>
      오늘 우리의 온도: {emotion} {heartPercent}°C
    </div>
  </div>
);

export default WelcomeUserSection; 