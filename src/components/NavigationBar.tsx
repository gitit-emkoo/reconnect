// src/components/NavigationBar.tsx
import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '../assets/Icon_Home.svg?react';
import ExpertIcon from '../assets/Icon_Expert.svg?react';
import ContentIcon from '../assets/Icon_Content.svg?react';
import CommunityIcon from '../assets/Icon_Community.svg?react';
import MyIcon from '../assets/Icon_My.svg?react';

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
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 1000; /* 다른 콘텐츠 위에 오도록 */
  height: 60px; /* 고정 높이 */
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

  color: ${props => (props.disabled ? '#ccc' : props.$isActive ? '#4169E1' : '#6b7280')};
  
  svg {
    width: 20px;
    height: 20px;
    margin-bottom: 4px;
    fill: none;
    stroke: ${props => 
      props.disabled 
        ? '#ccc' 
        : props.$isActive 
          ? '#4169E1'
          : '#6b7280'};
    transition: stroke 0.2s ease-in-out;
  }

  ${props => 
    props.$isActive && !props.disabled 
    ? `
        background-image: linear-gradient(to right, #FF69B4, #4169E1);
        background-clip: text;
        -webkit-background-clip: text;
      ` 
    : ``}

  &:hover {
    ${props => 
      !props.$isActive && !props.disabled 
      ? `
          color: #FF69B4; 
          svg {
            stroke: rgb(245, 119, 241);
            fill: none;
          }
        ` 
      : ''}
  }
`;

interface NavigationBarProps {
  isSolo?: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ isSolo = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path: string, requiresPartner: boolean = false) => {
    if (requiresPartner && isSolo) {
      alert("파트너와 연결 후 이용 가능한 기능입니다. 파트너를 초대해보세요!");
      navigate("/invite");
    } else {
      navigate(path);
    }
  };

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
        onClick={() => handleNavClick("/content-center", true)}
        $isActive={location.pathname === '/content-center'}
        disabled={isSolo}
      >
        <ContentIcon />
        콘텐츠센터
      </NavButton>
      <NavButton
        onClick={() => handleNavClick("/community", true)}
        $isActive={location.pathname === '/community'}
        disabled={isSolo}
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
};

export default NavigationBar;