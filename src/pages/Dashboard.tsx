// src/pages/Dashboard.tsx (최종 수정)
import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
// import Calendar, { type CalendarProps } from 'react-calendar'; // DashboardCalendar로 이동
import 'react-calendar/dist/Calendar.css'; // DashboardCalendar 내부에서 import
import NavigationBar from "../components/NavigationBar";
import { AuthContext } from "../contexts/AuthContext";
import { InviteModal } from "../components/Invite/InviteModal";
import DashboardCalendar from "../components/Dashboard/DashboardCalendar"; // 새로 추가된 캘린더 컴포넌트
import WelcomeUserSection from "../components/Dashboard/WelcomeUserSection"; // 새로 추가
import PartnerConnectionCard from "../components/Dashboard/PartnerConnectionCard"; // 새로 추가
import IcToggleUp from '../assets/ic_toggle_up.svg?react';
import IcToggleDown from '../assets/ic_toggle_down.svg?react';
import iconCard from '../assets/Icon_card.png';
import iconDiary from '../assets/Icon_diary.png';
import iconChallenge from '../assets/Icon_challange.png';

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

const TopRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    
  }
`;

// WelcomeSection, WelcomeTitle, WelcomeSubtitle, ReportButton styled-components는 WelcomeUserSection.tsx로 이동
// PartnerCard, PartnerInfo, PartnerImageArea, PartnerCardTitle, PartnerName, PartnerTime, InviteButton styled-components는 PartnerConnectionCard.tsx로 이동

const MainContentLayout = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem; 
   

  @media (max-width: 992px) { 
    flex-direction: column;
  }
`;

const CalendarColumn = styled.div`
  flex: 1; 
  min-width: 300px; 
  max-width: 50%; 
  
  @media (max-width: 992px) {
    max-width: 100%; 
    width: 100%;
  }
`;

const MenuCardsColumn = styled.div`
  flex: 0 0 280px; 
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 992px) {
    width: 100%;
    flex: 1; 
  }
`;

const MenuCard = styled.div<{ disabled?: boolean }>`
  background-color: ${props => props.disabled ? '#f1f3f7' : '#2f3542'};
  border-radius: 1rem;
  padding: 1.2rem; 
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  color: ${props => props.disabled ? '#666' : '#fff'};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.disabled ? '#f1f3f7' : '#3d4453'};
  }
`;

const MenuTitle = styled.h2`
  font-size: 1.1rem; 
  margin-bottom: 0.4rem;
`;

const MenuText = styled.p`
  font-size: 0.8rem; 
  opacity: 0.8;
`;

// CalendarContainer, DotsContainer, Dot 등 캘린더 관련 Styled Components는 DashboardCalendar.tsx로 이동
// ModalBackdrop, ModalContent, ModalTitle, ModalInfoItem, CloseButton 등 모달 관련 Styled Components도 이동

// EventData interface 및 dummyEvents 데이터는 DashboardCalendar.tsx로 이동

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
const PartnerCard = styled.div`
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

const TestButtonContainer = styled.div`
  text-align: center;
  margin-top: 1rem;
  padding-bottom: 1rem; 
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

// CalendarValue 타입은 DashboardCalendar.tsx로 이동

// 메인 아이콘 메뉴 스타일 컴포넌트
const MainMenuRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  justify-content: center;
`;

const MainMenuItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70px;
  cursor: pointer;
`;

const MainMenuIcon = styled.img`
  width: 40px;
  height: 40px;
  margin-bottom: 6px;
`;

const MainMenuText = styled.span`
  font-weight: 500;
  font-size: 13px;
  color: #7C3AED;
  text-align: center;
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, isLoading } = useContext(AuthContext);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const today = new Date();
  // 임시 일정 및 상태 데이터
  const schedules: { text: string }[] = [];
  const hasSentEmotionCard = true;
  const hasReceivedEmotionCard = false;
  const hasEmotionDiary = true;
  // calendarDate, selectedDateData, isDateModalOpen, monthlyEvents state는 DashboardCalendar.tsx로 이동
  // calendarDate 관련 useEffect도 이동

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
    if (!user) return;
    if (user.partner) {
      setUser({ ...user, partner: undefined }); 
    } else {
      const testPartner = {
        id: "partner123",
        nickname: "TestPartner",
        email: "partner@example.com",
        imageUrl: "https://cdn.dailyvet.co.kr/wp-content/uploads/2024/05/15231647/20240515ceva_experts4.jpg", // 사용자가 새로 제공한 이미지 URL로 수정
      };
      setUser({ ...user, partner: testPartner as any });
    }
  };
  
  // formatDate, tileContent, handleCalendarChange, handleDayClick, handleMonthChange 함수는 DashboardCalendar.tsx로 이동

  if (isLoading) return <Container>로딩 중...</Container>;
  if (!user) return <Container>로그인이 필요합니다.</Container>;
  
  const logoUrl = '/images/reconnect.png';

  // 파트너 이미지 URL 결정 로직 수정
  let partnerDisplayImageUrl: string | null = null;
  if (user.partner && user.partner.imageUrl) {
    partnerDisplayImageUrl = user.partner.imageUrl;
  }

  return (
    <>
      <Container>
        <Header>
          <Logo src={logoUrl} alt="ReConnect Logo" onError={(e) => (e.currentTarget.style.display = 'none')} />
        
        </Header>

        <TopRowContainer>
          <WelcomeUserSection user={user} />
          <PartnerConnectionCard 
            user={user} 
            partnerDisplayImageUrl={partnerDisplayImageUrl} 
            onOpenInviteModal={() => setIsInviteModalOpen(true)} 
          />
        </TopRowContainer>
        
        <MainContentLayout>
          <MainMenuRow>
            <MainMenuItem onClick={() => navigate('/emotion-diary')}>
              <MainMenuIcon src={iconDiary} alt="감정일기 아이콘" />
              <MainMenuText>감정일기</MainMenuText>
            </MainMenuItem>
            <MainMenuItem onClick={() => navigate('/emotion-card')}>
              <MainMenuIcon src={iconCard} alt="감정카드 아이콘" />
              <MainMenuText>감정카드</MainMenuText>
            </MainMenuItem>
            <MainMenuItem onClick={() => navigate('/challenge')}>
              <MainMenuIcon src={iconChallenge} alt="챌린지 아이콘" />
              <MainMenuText>챌린지</MainMenuText>
            </MainMenuItem>
          </MainMenuRow>
          
          <MenuCardsColumn>
            
            {/* 오늘 날짜만 보이는 캘린더 토글 버튼 - UI 개선 */}
            <MenuCard as="div" style={{ padding: 0, background: 'none', boxShadow: 'none' }}>
              <button
                style={{
                  width: '100%',
                  padding: '1.2rem',
                  borderRadius: '1rem',
                  border: '1px solid #E64A8D',
                  background: '#fff',
                  color: '#E64A8D',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  minHeight: 80
                }}
                onClick={() => setShowCalendar(v => !v)}
              >
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
                    {today.getFullYear()}-{String(today.getMonth() + 1).padStart(2, '0')}-{String(today.getDate()).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: 14, color: '#666' }}>
                    {schedules.length === 0
                      ? "일정이 없습니다"
                      : schedules.map((s, i) => <div key={i}>{s.text}</div>)}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 24 }}>
                  {hasSentEmotionCard && <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFA500', display: 'inline-block' }} title="감정카드 보냄"></span>}
                  {hasReceivedEmotionCard && <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#32CD32', display: 'inline-block' }} title="감정카드 받음"></span>}
                  {hasEmotionDiary && <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF69B4', display: 'inline-block' }} title="감정일기 작성"></span>}
                  <span style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
                    {showCalendar ? <IcToggleUp width={24} height={24} /> : <IcToggleDown width={24} height={24} />}
                  </span>
                </div>
              </button>
            </MenuCard>
            {showCalendar && (
              <CalendarColumn>
                <DashboardCalendar />
              </CalendarColumn>
            )}

            {/* 광고넣기 */}
            <MenuCard onClick={() => handleFeatureClick("/onboarding")} disabled>
              <MenuTitle>광고입니다다</MenuTitle>
              <MenuText>광고 넣을 페이지 입니다. </MenuText>
            </MenuCard>
          </MenuCardsColumn>
        </MainContentLayout>
        
        <RecommendedSection>
          <RecommendedTitle>PARTNER ✨</RecommendedTitle>
          <RecommendedGrid>
            <PartnerCard onClick={() => alert('콘텐츠 준비중입니다.')}>
              <span role="img" aria-label="couple emoji" style={{fontSize: '2rem', marginBottom: '0.5rem'}}>👩‍❤️‍👨</span>
              
            </PartnerCard>
            <PartnerCard onClick={() => alert('콘텐츠 준비중입니다.')}>
              <span role="img" aria-label="conversation emoji" style={{fontSize: '2rem', marginBottom: '0.5rem'}}>💬</span>
              
            </PartnerCard>
            <PartnerCard onClick={() => alert('콘텐츠 준비중입니다.')}>
              <span role="img" aria-label="gift emoji" style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🎁</span>
              
            </PartnerCard>
          </RecommendedGrid>
        </RecommendedSection>

        <TestButtonContainer>
          <TestButton onClick={handleToggleTestPartner}>
            {user.partner ? "테스트 파트너 연결 해제" : "테스트 파트너 연결"}
          </TestButton>
        </TestButtonContainer>

      </Container>
      <NavigationBar />

      {isInviteModalOpen && <InviteModal onClose={() => setIsInviteModalOpen(false)} />}

      {/* 날짜 클릭 시 나타나는 모달은 DashboardCalendar 내부로 이동 */}
    </>
  );
};

export default Dashboard;
