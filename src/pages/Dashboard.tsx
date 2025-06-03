// src/pages/Dashboard.tsx (업데이트된 부분)
import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import { AuthContext } from "../contexts/AuthContext";
import { InviteModal } from "../components/Invite/InviteModal";

const Container = styled.div`
  padding: 1.5rem;
  min-height: calc(100vh - 60px);
  background-color: #ffffff;
  padding-bottom: 80px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Logo = styled.img`
  width: 120px;
  height: auto;
`;

const MyPageButton = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
`;

const TopRowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const WelcomeSection = styled.div`
  flex: 1;
`;

const WelcomeTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.p`
  color: #666;
  font-size: 1rem;
`;

const PartnerCard = styled.div`
  position: relative;
  border-radius: 1rem;
  width: 100%;
  min-height: 160px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  color: white;
  overflow: hidden;
  background-color: #FFC0CB;
  display: flex;

  @media (max-width: 768px) {
    width: 280px;
  }
`;

const PartnerInfo = styled.div`
  position: relative;
  z-index: 2;
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const PartnerImageArea = styled.div<{ imageUrl: string }>`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 65%;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  mask-image: linear-gradient(to left, black 55%, transparent 85%);
  -webkit-mask-image: linear-gradient(to left, black 55%, transparent 85%);
`;

const PartnerCardTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
`;

const PartnerName = styled.div`
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const PartnerTime = styled.div`
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const InviteButton = styled.button`
  background-color: rgba(255, 255, 255, 0.9);
  color: #E64A8D;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: auto;
  align-self: flex-start;

  &:hover {
    background-color: rgba(255, 255, 255, 1);
  }
`;

const MenuCard = styled.div<{ disabled?: boolean }>`
  background-color: ${props => props.disabled ? '#f1f3f7' : '#2f3542'};
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  color: ${props => props.disabled ? '#666' : '#fff'};

  &:hover {
    background-color: ${props => props.disabled ? '#f1f3f7' : '#3d4453'};
  }
`;

const MenuTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const MenuText = styled.p`
  font-size: 0.875rem;
  opacity: 0.8;
`;

const RecommendedSection = styled.div`
  margin-top: 2rem;
`;

const RecommendedTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const RecommendedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
`;

const RecommendedCard = styled.div`
  background-color: #e8f5e9;
  border-radius: 1rem;
  padding: 1rem;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const RecommendedName = styled.div`
  font-size: 0.875rem;
  text-align: center;
`;

const RecommendedTime = styled.div`
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
`;

// 테스트용 버튼을 위한 스타일 (옵션, 간단하게 인라인으로도 가능)
const TestButtonContainer = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-bottom: 1rem; // 네비게이션 바와의 간격 확보
`;

const TestButton = styled.button`
  background-color: #777;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background-color: #555;
  }
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, isLoading } = useContext(AuthContext);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [navigate, user, isLoading]);

  const handleFeatureClick = (path: string, requiresPartner: boolean = false) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (requiresPartner && !user.partner) {
      alert("파트너와 연결 후 이용 가능한 기능입니다. 파트너를 초대해보세요!");
      navigate("/invite");
    } else {
      navigate(path);
    }
  };

  const handleToggleTestPartner = () => {
    if (!user) return; // 사용자가 없으면 아무것도 안 함

    if (user.partner) {
      // 파트너가 있으면 제거 (partner 속성을 undefined로 설정하여 제거 효과)
      const { partner, ...userWithoutPartner } = user;
      setUser(userWithoutPartner as any); // 'partner'가 없는 User 타입으로 간주 (실제 타입에 맞게 조정 필요)
                                       // 또는 setUser({ ...user, partner: undefined }); 와 같이 명시적 제거
    } else {
      // 파트너가 없으면 추가
      setUser({
        ...user,
        partner: {
          id: 'test-partner-001',
          nickname: '임시 배우자',
          email: 'test.partner@example.com',
          // User['partner'] 타입에 필요한 다른 필드가 있다면 추가
        },
      });
    }
  };

  return (
    <>
      <Container>
        <Header>
          <Logo src="/images/reconnect.png" alt="Reconnect Logo" />
          <MyPageButton onClick={() => navigate('/my')}>👤</MyPageButton>
        </Header>

        <TopRowContainer>
          <WelcomeSection>
            {isLoading ? (
              <WelcomeTitle>로딩 중...</WelcomeTitle>
            ) : user ? (
              <WelcomeTitle>{user.nickname}님, 반가워요!</WelcomeTitle>
            ) : (
              <WelcomeTitle>로그인이 필요합니다.</WelcomeTitle>
            )}
            <WelcomeSubtitle>We Wish you have a good day</WelcomeSubtitle>
          </WelcomeSection>

          <PartnerCard>
            <PartnerInfo>
              <div>
                <PartnerCardTitle style={{ color: '#333' }}>배우자</PartnerCardTitle>
                {user && user.partner ? (
                  <>
                    <PartnerName style={{ color: '#555' }}>{user.partner.nickname}</PartnerName>
                    <PartnerTime style={{ color: '#777' }}>3-10 MIN</PartnerTime>
                  </>
                ) : (
                  <PartnerName style={{ color: '#555', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                    파트너와 연결하고<br/>더 깊은 관계를 만들어가세요!
                  </PartnerName>
                )}
              </div>
              {!user?.partner && (
                <InviteButton onClick={() => setIsInviteModalOpen(true)}>파트너 초대하기</InviteButton>
              )}
            </PartnerInfo>
            <PartnerImageArea 
              imageUrl={
                user?.partner 
                  ? '/images/husband.jpg' 
                  : '/images/couple-placeholder.png'
              }
            />
          </PartnerCard>
        </TopRowContainer>

        <MenuCard disabled={!user?.partner} onClick={() => handleFeatureClick("/calendar", true)}>
          <MenuTitle>Daily Thought</MenuTitle>
          <MenuText>MEDITATION • 3-10 MIN</MenuText>
        </MenuCard>

        <MenuCard disabled={!user?.partner} onClick={() => handleFeatureClick("/emotion-card", true)}>
          <MenuTitle>감정카드</MenuTitle>
          <MenuText>오늘의 감정을 카드에 담아보세요</MenuText>
        </MenuCard>

        <MenuCard onClick={() => handleFeatureClick("/emotion-diary")}>
          <MenuTitle>감정일기</MenuTitle>
          <MenuText>오늘의 감정을 기록해보세요</MenuText>
        </MenuCard>

        <RecommendedSection>
          <RecommendedTitle>Recommended for you</RecommendedTitle>
          <RecommendedGrid>
            <RecommendedCard>
              <RecommendedName>Focus</RecommendedName>
              <RecommendedTime>MEDITATION • 3-10 MIN</RecommendedTime>
            </RecommendedCard>
            <RecommendedCard>
              <RecommendedName>Happiness</RecommendedName>
              <RecommendedTime>MEDITATION • 3-10 MIN</RecommendedTime>
            </RecommendedCard>
          </RecommendedGrid>
        </RecommendedSection>

        {/* 테스트용 파트너 토글 버튼 추가 */}
        {!isLoading && user && (
          <TestButtonContainer>
            <TestButton onClick={handleToggleTestPartner}>
              {user.partner ? "임시 배우자 연결 해제" : "임시 배우자 연결"}
            </TestButton>
          </TestButtonContainer>
        )}
      </Container>
      <NavigationBar />

      {isInviteModalOpen && (
        <InviteModal 
          onClose={() => setIsInviteModalOpen(false)} 
          onInviteSuccess={() => {
            alert("파트너 초대 절차가 시작되었습니다! 상대방의 수락을 기다려주세요.");
            setIsInviteModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Dashboard;
