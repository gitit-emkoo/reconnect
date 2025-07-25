import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as HomeIcon } from '../assets/Icon_Home.svg';
import { ReactComponent as ExpertIcon } from '../assets/Icon_Expert.svg';
import { ReactComponent as ContentsIcon } from '../assets/Icon_ContentsCenter.svg';
import { ReactComponent as CommunityIcon } from '../assets/Icon_Community.svg';
import { ReactComponent as MyIcon } from '../assets/Icon_My.svg';

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: white;
  padding: 0.5rem 0;
  padding-bottom: env(safe-area-inset-bottom, 24px); /* 하단 시스템 UI 안전 영역 확보 */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 1000; 
  height: 60px; 
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  overflow: hidden;
`;

interface NavButtonProps {
  $isActive?: boolean;
  disabled?: boolean;
}

const NavButton = styled.button<NavButtonProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  background: none;
  border: none;
  font-size: 0.75rem;
  font-weight: ${props => (props.$isActive ? '600' : '500')};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  padding: 0.2rem 0;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  transition: color 0.2s ease-in-out, stroke 0.2s ease-in-out;

  color: ${props => (props.disabled ? '#ccc' : props.$isActive ? '#785CD2' : '#6b7280')};
  
  svg {
    width: 24px;
    height: 24px;
    margin-bottom: 4px;
    fill: ${props => 
      props.disabled 
        ? '#ccc' 
        : props.$isActive 
          ? '#785CD2'
          : '#6b7280'};
    stroke: none;
    transition: stroke 0.2s ease-in-out;
  }

  ${props => 
    props.$isActive && !props.disabled 
    ? `
        background-clip: text;
        -webkit-background-clip: text;
      ` 
    : ``}
      : ''}
  }
`;

interface NavigationBarProps {
  isSolo?: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  return (
    <NavContainer>
      <NavButton
        onClick={() => handleNavClick("/dashboard")}
        $isActive={location.pathname === '/dashboard'}
      >
        <HomeIcon />
        Home
      </NavButton>
      <NavButton
        onClick={() => handleNavClick("/expert")}
        $isActive={location.pathname === '/expert'}
      >
        <ExpertIcon />
        전문가
      </NavButton>
      <NavButton
        onClick={() => handleNavClick("/content-center")}
        $isActive={location.pathname === '/content-center'}
      >
        <ContentsIcon />
        콘텐츠센터
      </NavButton>
      <NavButton
        onClick={() => handleNavClick("/community")}
        $isActive={location.pathname === '/community'}
      >
        <CommunityIcon />
        커뮤니티
      </NavButton>
      <NavButton
        onClick={() => handleNavClick("/my")}
        $isActive={location.pathname === '/my'}
      >
        <MyIcon />
        MY
      </NavButton>
    </NavContainer>
  );
});

export default NavigationBar;