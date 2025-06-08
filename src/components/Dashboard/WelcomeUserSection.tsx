import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
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
  font-size: 1rem;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    font-size: 0.8rem; 
  }
`;

const ReportButton = styled.button`
  background-color: #E64A8D;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.9rem;
  margin-top: auto;
  &:hover {
    background-color: #c33764;
  }
  @media (max-width: 768px) {
    font-size: 0.8rem; 
  }
`;

interface WelcomeUserSectionProps {
  user: User;
}

const WelcomeUserSection: React.FC<WelcomeUserSectionProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <WelcomeSectionContainer>
      <WelcomeTitle>{user.nickname}님, <br/>반가워요!</WelcomeTitle>
      <WelcomeSubtitle>오늘, 우리 사이는 어떤가요?</WelcomeSubtitle>
      <ReportButton onClick={() => navigate("/report")}>리포트 보기</ReportButton>
    </WelcomeSectionContainer>
  );
};

export default WelcomeUserSection; 