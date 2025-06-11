// src/pages/Dashboard.tsx (최종 수정)
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
// import Calendar, { type CalendarProps } from 'react-calendar'; // DashboardCalendar로 이동
import 'react-calendar/dist/Calendar.css'; // DashboardCalendar 내부에서 import
import NavigationBar from "../components/NavigationBar";
import useAuthStore from "../store/authStore"; // AuthContext 대신 useAuthStore import
import { InviteModal } from "../components/Invite/InviteModal";
import DashboardCalendar from "../components/Dashboard/DashboardCalendar"; // 새로 추가된 캘린더 컴포넌트
import WelcomeUserSection from "../components/Dashboard/WelcomeUserSection"; // 새로 추가 // 새로 추가

import type { User } from "../types/user"; // types/user.ts 에서 User 타입 import
import { ReactComponent as IcToggleUp } from '../assets/ic_toggle_up.svg';
import { ReactComponent as IcToggleDown } from '../assets/ic_toggle_down.svg';
import iconCard from '../assets/love-letter_14299289.png';
import iconDiary from '../assets/travel-journal_16997872.png';
import iconChallenge from '../assets/finish_11741557.png';
import iconReport from '../assets/chart_11709638.png';
import HeartGauge from '../components/Dashboard/HeartGauge';
import PartnerConnectCard from '../components/Dashboard/PartnerConnectCard';
import PartnerCard from '../components/Dashboard/PartnerCard';
import InviteCodeInputModal from '../components/Invite/InviteCodeInputModal';
import NotificationBell from '../components/NotificationBell';
import { useNotificationStore } from '../store/notificationsStore';
import ConfirmationModal from '../components/common/ConfirmationModal';

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


// WelcomeSection, WelcomeTitle, WelcomeSubtitle, ReportButton styled-components는 WelcomeUserSection.tsx로 이동
// PartnerCard, PartnerInfo, PartnerImageArea, PartnerCardTitle, PartnerName, PartnerTime, InviteButton styled-components는 PartnerConnectionCard.tsx로 이동


const PartnerSection = styled.div`
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
  color: #666;
  text-align: center;
`;

const CenteredContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 새로 추가될 Styled Components
const CalendarToggleButton = styled.button`
  width: 100%;
  padding: 1.2rem;
  border-radius: 1rem;
  border: 1px solid #E64A8D;
  background: #fff;
  color: #E64A8D;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  min-height: 80px;
  text-align: left;
`;

const DateInfo = styled.div`
  flex: 1;
`;

const DateText = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const ScheduleText = styled.div`
  font-size: 14px;
  color: #666;
`;

const StatusIcons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  min-width: 24px;
`;

const StatusDot = styled.span<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
  display: inline-block;
`;

const ToggleIconWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-left: 8px;
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Left = styled.div`
  flex: 0 0 auto;
`;

const Right = styled.div`
  flex: 1 1 0;
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, accessToken } = useAuthStore();
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

  // 로딩 상태를 isLoggedIn과 user 존재 여부로 판단
  const isLoading = !isLoggedIn && !user && !!accessToken;

  const prevPartnerId = useRef(user?.partner?.id);

  // 1. 폴링: 5초마다 user 정보 최신화
  useEffect(() => {
    const interval = setInterval(() => {
      useAuthStore.getState().checkAuth();
    }, 5000); // 5초마다
    return () => clearInterval(interval);
  }, []);

  // 2. 파트너 연결 알림
  useEffect(() => {
    if (user?.partner?.id && prevPartnerId.current !== user.partner.id) {
      useNotificationStore.getState().addNotification('파트너가 연결되었습니다!');
      prevPartnerId.current = user.partner.id;
    }
  }, [user?.partner?.id]);

  useEffect(() => {
    // 토큰은 있는데 유저 정보가 없는 초기 로딩 상태가 아니라면, 리디렉션 로직 수행
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [navigate, user, isLoading]);
  
  const [showPartnerModal, setShowPartnerModal] = useState(false);

  const handleFeatureClick = (path: string, requiresPartner: boolean = false) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (requiresPartner && !user.partner) {
      setShowPartnerModal(true);
      return;
    }
    navigate(path);
  };

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);

  if (!user) return (
    <CenteredContainer>
      <p>로그인이 필요합니다.</p>
    </CenteredContainer>
  );
  
  const logoUrl = '/images/reconnect.png';

  const partner = user.partner;

  return (
    <>
      <Container>
        <Header>
          <Logo src={logoUrl} alt="Reconnect Logo" />
          <NotificationBell />
        </Header>

        <TopSection>
          <Left>
            <HeartGauge percentage={76} size={120} />
          </Left>
          <Right>
            <WelcomeUserSection user={user as User} heartPercent={76} emotion="따뜻함" />
          </Right>
        </TopSection>

        {partner ? <PartnerCard partner={partner} coupleCreatedAt={(user as User).couple?.createdAt} /> : <PartnerConnectCard onShareClick={() => setIsShareModalOpen(true)} onInputClick={() => setIsInputModalOpen(true)} />}

        <MainMenuRow style={{ margin: '2.5rem 0' }}>
          <MainMenuItem
            onClick={() => handleFeatureClick('/emotion-diary')}
          >
            <MainMenuIcon src={iconDiary} alt="감정일기 아이콘" />
            <MainMenuText>감정일기</MainMenuText>
          </MainMenuItem>
          <MainMenuItem
            onClick={() => handleFeatureClick('/emotion-card', true)}
            style={{ opacity: !user.partner ? 0.5 : 1, cursor: !user.partner ? 'not-allowed' : 'pointer' }}
          >
            <MainMenuIcon src={iconCard} alt="감정카드 아이콘" />
            <MainMenuText>감정카드</MainMenuText>
          </MainMenuItem>
          <MainMenuItem
            onClick={() => handleFeatureClick('/challenge', true)}
            style={{ opacity: !user.partner ? 0.5 : 1, cursor: !user.partner ? 'not-allowed' : 'pointer' }}
          >
            <MainMenuIcon src={iconChallenge} alt="챌린지 아이콘" />
            <MainMenuText>챌린지</MainMenuText>
          </MainMenuItem>
          <MainMenuItem onClick={() => handleFeatureClick('/report')}>
            <MainMenuIcon src={iconReport} alt="리포트 아이콘콘" />
            <MainMenuText>리포트</MainMenuText>
          </MainMenuItem>
        </MainMenuRow>

        <MenuCardsColumn>
          <MenuCard as="div" style={{ padding: 0, background: 'none', boxShadow: 'none' }}>
            <CalendarToggleButton onClick={() => setShowCalendar(v => !v)}>
              <DateInfo>
                <DateText>
                  {today.getFullYear()}-{String(today.getMonth() + 1).padStart(2, '0')}-{String(today.getDate()).padStart(2, '0')}
                </DateText>
                <ScheduleText>
                  {schedules.length === 0
                    ? "일정이 없습니다"
                    : schedules.map((s, i) => <div key={i}>{s.text}</div>)}
                </ScheduleText>
              </DateInfo>
              <StatusIcons>
                {hasSentEmotionCard && <StatusDot color="#FFA500" title="감정카드 보냄" />}
                {hasReceivedEmotionCard && <StatusDot color="#32CD32" title="감정카드 받음" />}
                {hasEmotionDiary && <StatusDot color="#FF69B4" title="감정일기 작성" />}
                <ToggleIconWrapper>
                  {showCalendar ? <IcToggleUp width={24} height={24} /> : <IcToggleDown width={24} height={24} />}
                </ToggleIconWrapper>
              </StatusIcons>
            </CalendarToggleButton>
          </MenuCard>
          {showCalendar && (
            <PartnerSection>
              <DashboardCalendar />
            </PartnerSection>
          )}

          {/* 광고넣기 */}
          <MenuCard onClick={() => handleFeatureClick("/onboarding")} disabled>
            <MenuTitle>광고입니다다</MenuTitle>
            <MenuText>광고 넣을 페이지 입니다. </MenuText>
          </MenuCard>
        </MenuCardsColumn>

      </Container>
      <NavigationBar isSolo={!user.partner} />
      {isInviteModalOpen && <InviteModal onClose={() => setIsInviteModalOpen(false)} />}
      {isShareModalOpen && (
        <InviteModal onClose={() => setIsShareModalOpen(false)} />
      )}
      {isInputModalOpen && (
        <InviteCodeInputModal onClose={() => setIsInputModalOpen(false)} />
      )}
      <ConfirmationModal
        isOpen={showPartnerModal}
        onRequestClose={() => setShowPartnerModal(false)}
        onConfirm={() => setShowPartnerModal(false)}
        message="파트너 연결 후에 사용 가능합니다."
      />
    </>
  );
};

export default Dashboard;
