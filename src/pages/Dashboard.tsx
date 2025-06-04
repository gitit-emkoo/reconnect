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
  margin-bottom: 1.5rem; 

  @media (max-width: 768px) {
    flex-direction: row; 
    align-items: flex-start;
  }
`;

// WelcomeSection, WelcomeTitle, WelcomeSubtitle, ReportButton styled-components는 WelcomeUserSection.tsx로 이동
// PartnerCard, PartnerInfo, PartnerImageArea, PartnerCardTitle, PartnerName, PartnerTime, InviteButton styled-components는 PartnerConnectionCard.tsx로 이동

const MainContentLayout = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem; 
  align-items: flex-start; 

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
const TestButtonContainer = styled.div`
  text-align: center;
  margin-top: 2rem;
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, isLoading } = useContext(AuthContext);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
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
  
  const logoUrl = '/logo.png';

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
          <MyPageButton onClick={() => navigate("/mypage")}>
            <span role="img" aria-label="mypage">👤</span>
          </MyPageButton>
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
          <CalendarColumn>
            <DashboardCalendar />
          </CalendarColumn>
          <MenuCardsColumn>
            <MenuCard onClick={() => handleFeatureClick("/emotion-diary")}>
              <MenuTitle>오늘의 감정일기 쓰러가기 📝</MenuTitle>
              <MenuText>솔직한 감정을 기록하고 서로를 더 깊이 이해해 보세요.</MenuText>
            </MenuCard>
            <MenuCard onClick={() => handleFeatureClick("/emotion-card")}>
              <MenuTitle>파트너에게 감정카드 보내기 🃏</MenuTitle> 
              <MenuText>오늘 나의 감정을 표현하고 따뜻한 마음을 전달해보세요.</MenuText> 
            </MenuCard>
            <MenuCard onClick={() => handleFeatureClick("/challenge")}>
              <MenuTitle>오늘의 미션 도전하기 🔥</MenuTitle>
              <MenuText>함께 미션을 수행하며 즐거운 추억을 만들어보세요.</MenuText>
            </MenuCard>
            <MenuCard onClick={() => handleFeatureClick("/calendar-page")} disabled>
              <MenuTitle>전체 일정 보기 📅 (준비중)</MenuTitle>
              <MenuText>모든 기록을 한눈에 확인하는 상세 페이지입니다.</MenuText>
            </MenuCard>
          </MenuCardsColumn>
        </MainContentLayout>
        
        <RecommendedSection>
          <RecommendedTitle>이런 활동은 어때요? ✨</RecommendedTitle>
          <RecommendedGrid>
            <RecommendedCard onClick={() => alert('콘텐츠 준비중입니다.')}>
              <span role="img" aria-label="couple emoji" style={{fontSize: '2rem', marginBottom: '0.5rem'}}>👩‍❤️‍👨</span>
              <RecommendedName>갈등 해결 가이드</RecommendedName>
              <RecommendedTime>15분 소요</RecommendedTime>
            </RecommendedCard>
            <RecommendedCard onClick={() => alert('콘텐츠 준비중입니다.')}>
              <span role="img" aria-label="conversation emoji" style={{fontSize: '2rem', marginBottom: '0.5rem'}}>💬</span>
              <RecommendedName>깊은 대화 주제</RecommendedName>
              <RecommendedTime>주제별 상이</RecommendedTime>
            </RecommendedCard>
            <RecommendedCard onClick={() => alert('콘텐츠 준비중입니다.')}>
              <span role="img" aria-label="gift emoji" style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🎁</span>
              <RecommendedName>서프라이즈 이벤트</RecommendedName>
              <RecommendedTime>계획하기 나름!</RecommendedTime>
            </RecommendedCard>
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
