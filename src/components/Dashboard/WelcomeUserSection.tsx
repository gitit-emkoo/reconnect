import React from 'react';
import styled from 'styled-components';
import type { User } from '../../types/user';

// Styled Components (Dashboard.tsx에서 이동)
const WelcomeSectionContainer = styled.div`
  flex: 1 1 0;
  min-width: 0;
  width: 50%;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 50%;
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  @media (max-width: 768px) {
    font-size: 1.2rem; 
  }
`;

const WelcomeSubtitle = styled.p`
  color: #666;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    font-size: 0.8rem; 
  }
`;

interface WelcomeUserSectionProps {
  user: User;
}

const WelcomeUserSection: React.FC<WelcomeUserSectionProps> = ({ user }) => {

  return (
    <WelcomeSectionContainer>
      <WelcomeTitle>{user.nickname}님, <br/>반가워요!</WelcomeTitle>
      <WelcomeSubtitle>오늘, 우리 사이는 어떤가요?</WelcomeSubtitle>
    </WelcomeSectionContainer>
  );
};

export default WelcomeUserSection; 