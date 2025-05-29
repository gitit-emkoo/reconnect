// src/components/NavigationBar.tsx
import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

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
}

const NavButton = styled.button<NavButtonProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  background: none;
  border: none;
  color: ${props => (props.$isActive ? '#14b8a6' : '#6b7280')}; /* 활성/비활성 색상 */
  font-size: 0.75rem;
  font-weight: ${props => (props.$isActive ? '600' : '500')};
  cursor: pointer;
  transition: color 0.2s ease-in-out;
  padding: 0.2rem 0; /* 내부 여백 조정 */

  &:hover {
    color: #0d9488;
  }

  svg {
    font-size: 1.5rem; /* 아이콘 크기 */
    margin-bottom: 0.2rem;
  }
`;

// 간단한 아이콘 대신 텍스트로 대체하거나, 실제 아이콘 라이브러리 사용
const IconPlaceholder = styled.div`
  width: 24px; /* 아이콘 크기 맞춤 */
  height: 24px;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px; /* 텍스트와의 간격 */
`;

// 임시 아이콘 (나중에 실제 아이콘으로 대체 필요)
const HomeIcon = () => <IconPlaceholder>🏠</IconPlaceholder>;
const ExpertIcon = () => <IconPlaceholder>👨‍🏫</IconPlaceholder>; // 전문가
const ContentIcon = () => <IconPlaceholder>📚</IconPlaceholder>; // 콘텐츠센터
const CommunityIcon = () => <IconPlaceholder>👥</IconPlaceholder>;
const MyIcon = () => <IconPlaceholder>👤</IconPlaceholder>;

interface NavigationBarProps {
  // isSolo 상태를 props로 받아와서 특정 버튼을 disabled 처리할 수도 있습니다.
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
      {/* 전문가 페이지는 일단 isSolo와 관계없이 접근 가능하게 처리, 필요 시 변경 */}
      <NavButton
        onClick={() => handleNavClick("/expert")} // 전문가 페이지 라우트 추가 필요
        $isActive={location.pathname === '/expert'}
      >
        <ExpertIcon />
        전문가
      </NavButton>
      <NavButton
        onClick={() => handleNavClick("/content-center", true)} // 콘텐츠센터는 파트너 필요
        $isActive={location.pathname === '/content-center'}
        disabled={isSolo}
      >
        <ContentIcon />
        콘텐츠센터
      </NavButton>
      <NavButton
        onClick={() => handleNavClick("/community", true)} // 커뮤니티는 파트너 필요
        $isActive={location.pathname === '/community'}
        disabled={isSolo}
      >
        <CommunityIcon />
        커뮤니티
      </NavButton>
      <NavButton
        onClick={() => handleNavClick("/my")} // 마이페이지는 항상 접근 가능
        $isActive={location.pathname === '/my'}
      >
        <MyIcon />
        MY
      </NavButton>
    </NavContainer>
  );
};

export default NavigationBar;