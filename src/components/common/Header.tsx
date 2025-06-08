import React from 'react';
import styled from 'styled-components';
import BackButton from './BackButton';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  className?: string;
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 56px;
  margin: 0 auto;
  background: white;
  border-bottom: 1px solid #f3f3f3;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  text-align: center;
`;

const StyledBackButton = styled(BackButton)`
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
`;

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false, className }) => {
  return (
    <HeaderContainer className={className}>
      {showBackButton && <StyledBackButton />}
      <Title>{title}</Title>
    </HeaderContainer>
  );
};

export default Header; 