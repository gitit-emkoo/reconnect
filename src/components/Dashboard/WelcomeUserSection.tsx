import React from 'react';

interface WelcomeUserSectionProps {
  user: { nickname: string };
  heartPercent: number;
  emotion: string;
}

const WelcomeUserSection: React.FC<WelcomeUserSectionProps> = ({ user, emotion }) => (
  <div>
    <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 8 }}>
      {user.nickname}님<br/> 감정은 꼭 챙기세요
    </div>
    <div style={{ color: '#888', fontSize: '1rem' }}>
      우리의 온도 <br/>{emotion} 
    </div>
  </div>
);

export default WelcomeUserSection; 