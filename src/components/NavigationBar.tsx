import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as HomeIcon } from '../assets/Icon_Home.svg';
import { ReactComponent as ExpertIcon } from '../assets/Icon_Expert.svg';
import { ReactComponent as ContentsIcon } from '../assets/Icon_Recipe.svg';
import { ReactComponent as CommunityIcon } from '../assets/Icon_Community.svg';
import { ReactComponent as MyIcon } from '../assets/Icon_My.svg';

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  background-color: white;
  padding: 0.3rem 0 0 0;
  /* 제스처 바와 아이콘이 겹치지 않도록 최소 여백 포함 */
  padding-bottom: max(var(--safe-area-inset-bottom, 0px), var(--kb, 8px));
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 1000; 
  min-height: 60px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  overflow: hidden;
  
  /* 웹뷰 최적화 */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  
  /* 하단 inset을 포함한 총 높이 적용 */
  height: calc(var(--nav-height, 72px) + max(var(--safe-area-inset-bottom, 0px), var(--kb, 0px)));
`;

interface NavButtonProps {
  $isActive?: boolean;
  disabled?: boolean;
}

const NavButton = styled.button<NavButtonProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  background: none;
  border: none;
  font-size: 0.8rem;
  font-weight: ${props => (props.$isActive ? '600' : '500')};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  padding: 0.5rem 0;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  transition: color 0.2s ease-in-out, stroke 0.2s ease-in-out;

  color: ${props => (props.disabled ? '#ccc' : props.$isActive ? '#785CD2' : '#6b7280')};
  
  svg {
    width: 24px;
    height: 24px;
    margin-bottom: 2px;
    fill: ${props => 
      props.disabled 
        ? '#ccc' 
        : props.$isActive 
          ? '#785CD2'
          : '#6b7280'};
    stroke: none;
    transition: stroke 0.2s ease-in-out;
  }

  /* 모바일에서 더 큰 글씨 */
  @media screen and (max-width: 768px) {
    font-size: 0.85rem;
  }
  
  @media screen and (max-width: 480px) {
    font-size: 0.9rem;
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
  const [hiddenByKeyboard, setHiddenByKeyboard] = useState(false);

  useEffect(() => {
    const visual: any = (window as any).visualViewport;
    const root = document.getElementById('root');
    const detect = () => {
      const visualHeight = visual?.height || window.innerHeight;
      const delta = window.innerHeight - visualHeight;
      const isOpen = delta > 150; // 키보드가 열리면 보통 150px 이상 줄어듦
      setHiddenByKeyboard(isOpen);
      if (root) root.classList.toggle('keyboard-open', isOpen);
    };
    if (visual && typeof visual.addEventListener === 'function') {
      visual.addEventListener('resize', detect);
    }
    window.addEventListener('focusin', detect);
    window.addEventListener('focusout', () => setTimeout(detect, 50));
    detect();
    return () => {
      if (visual && typeof visual.removeEventListener === 'function') {
        visual.removeEventListener('resize', detect);
      }
      window.removeEventListener('focusin', detect);
    };
  }, []);

  const handleNavClick = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  if (hiddenByKeyboard) return null;

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
        부부처방소
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