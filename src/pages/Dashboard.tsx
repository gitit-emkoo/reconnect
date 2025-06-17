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
import Popup from '../components/common/Popup';
import { useQuery } from '@tanstack/react-query';
import { fetchDiaries } from '../api/diary';
import { fetchSentMessages, fetchReceivedMessages } from './EmotionCard';
import { useEmotionCardNotifications } from '../hooks/useEmotionCardNotifications';
import challengeApi, { Challenge } from '../api/challenge';

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

const StatusIconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

// StatusDot과 ToggleIconWrapper를 styled-components로 정의
const StatusDot = styled.span<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
  display: inline-block;
`;

// DiaryStatus 타입 정의
interface DiaryStatus {
  hasEmotionDiary: boolean;
  hasSentEmotionCard: boolean;
  hasReceivedEmotionCard: boolean;
}

const StatusIcons: React.FC<DiaryStatus> = ({ hasEmotionDiary, hasSentEmotionCard, hasReceivedEmotionCard }) => (
  <StatusIconsContainer style={{ flexDirection: 'row', alignItems: 'center', minWidth: 24, gap: 3 }}>
    {hasEmotionDiary && <StatusDot color="#FF69B4" title="감정일기 작성" style={{ width: 7, height: 7 }} />}
    {hasSentEmotionCard && <StatusDot color="#FFA500" title="감정카드 보냄" style={{ width: 7, height: 7 }} />}
    {hasReceivedEmotionCard && <StatusDot color="#32CDFF" title="감정카드 받음" style={{ width: 7, height: 7 }} />}
  </StatusIconsContainer>
);

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
  const today = new Date();
  const { data: diaryList = [] } = useQuery({
    queryKey: ['diaries'],
    queryFn: fetchDiaries
  });
  const todayString = new Date().toISOString().slice(0, 10);

  // 로딩 상태를 isLoggedIn과 user 존재 여부로 판단
  const isLoading = !isLoggedIn && !user && !!accessToken;

  const prevPartnerId = useRef(user?.partner?.id);

  // 1. 폴링: 5초마다 user 정보 최신화 (파트너가 없을 때만)
  useEffect(() => {
    if (!user?.partner) {
      const interval = setInterval(() => {
        useAuthStore.getState().checkAuth();
      }, 5000); // 5초마다
      return () => clearInterval(interval);
    }
  }, [user?.partner]);

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
  const [showPopup, setShowPopup] = useState(true);

  // (선택) 최초 진입 시 한 번만 보여주고 싶으면 아래 주석 해제
  // useEffect(() => {
  //   setShowPopup(true);
  // }, []);

  if (!user) return (
    <CenteredContainer>
      <p>로그인이 필요합니다.</p>
    </CenteredContainer>
  );
  
  const logoUrl = '/images/reconnect.png';

  const partner = user.partner;

  // 감정카드 데이터 useQuery 추가 (EmotionCard.tsx 참고)
  const { data: sentMessages = [] } = useQuery({
    queryKey: ['sentMessages', user?.id, user?.partner?.id],
    queryFn: async () => {
      if (!user?.partner?.id) return [];
      return await fetchSentMessages();
    },
    enabled: !!user?.partner?.id
  });
  const { data: receivedMessages = [] } = useQuery({
    queryKey: ['receivedMessages', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await fetchReceivedMessages();
    },
    enabled: !!user?.id,
    refetchInterval: 5000 // 5초마다 자동 갱신
  });

  // 커스텀 훅 사용
  useEmotionCardNotifications(receivedMessages);

  // 오늘 날짜의 상태 계산
  const getDiaryStatus = (dateString: string): DiaryStatus => ({
    hasEmotionDiary: diaryList.some(d => d.date === dateString),
    hasSentEmotionCard: sentMessages.some((msg: any) => msg.senderId === user?.id && msg.createdAt.slice(0, 10) === dateString),
    hasReceivedEmotionCard: receivedMessages.some((msg: any) => msg.receiverId === user?.id && msg.createdAt.slice(0, 10) === dateString),
  });

  const todayStatus = getDiaryStatus(todayString);

  // Dashboard 컴포넌트 내부에 일정 상태 추가
  const [schedules, setSchedules] = useState<{ date: string, text: string }[]>([]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleInput, setScheduleInput] = useState('');
  const [scheduleDate, setScheduleDate] = useState(todayString);

  // 오늘 일정 찾기
  const todaySchedule = schedules.find(s => s.date === todayString);

  // 일정 저장 함수
  const handleSaveSchedule = () => {
    if (!scheduleInput.trim()) return;
    setSchedules(prev => [
      ...prev.filter(s => s.date !== scheduleDate),
      { date: scheduleDate, text: scheduleInput }
    ]);
    setIsScheduleModalOpen(false);
    setScheduleInput('');
  };

  const prevReceivedIds = useRef<string[] | null>(null);
  useEffect(() => {
    if (receivedMessages && receivedMessages.length > 0) {
      if (prevReceivedIds.current === null) {
        // 최초 마운트: 알림 추가하지 않고 id만 저장
        prevReceivedIds.current = receivedMessages.map((msg: any) => msg.id);
        return;
      }
      const newCards = receivedMessages.filter((msg: any) => {
        const isNew = !prevReceivedIds.current!.includes(msg.id);
        // 이미 읽은 카드는 알림을 보내지 않음
        return isNew && !msg.isRead;
      });
      newCards.forEach(() => {
        useNotificationStore.getState().addNotification('새 감정카드가 도착했어요!', '/emotion-card?tab=received');
      });
      prevReceivedIds.current = receivedMessages.map((msg: any) => msg.id);
    }
  }, [receivedMessages]);

  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    // 진행중인 챌린지 정보 불러오기
    const fetchActiveChallenge = async () => {
      try {
        const challenge = await challengeApi.getActiveChallenge();
        setActiveChallenge(challenge);
      } catch (e) {
        setActiveChallenge(null);
      }
    };
    fetchActiveChallenge();
  }, []);

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

        {partner ? <PartnerCard 
        partner={partner} 
        user={{nickname: user.nickname??''}}
        coupleCreatedAt={(user as User).couple?.createdAt}
        activeChallengeTitle={activeChallenge?.title}
        /> : <PartnerConnectCard onShareClick={() => setIsShareModalOpen(true)} onInputClick={() => setIsInputModalOpen(true)} />}

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
          <MenuCard as="div" style={{ padding: 0, background: 'none', boxShadow: 'none', position: 'relative' }}>
            <CalendarToggleButton disabled style={{ pointerEvents: 'none', position: 'relative' }}>
              <DateInfo>
                <DateText>
                  {today.getFullYear()}-{String(today.getMonth() + 1).padStart(2, '0')}-{String(today.getDate()).padStart(2, '0')}
                </DateText>
                <ScheduleText>
                  {todaySchedule ? todaySchedule.text : '등록된 일정이 없습니다'}
                </ScheduleText>
              </DateInfo>
              <StatusIcons {...todayStatus} />
              <div
                style={{
                  position: 'absolute',
                  right: 18,
                  bottom: 12,
                  background: '#E64A8D',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px #e64a8d33',
                  zIndex: 2
                }}
                onClick={() => setIsScheduleModalOpen(true)}
                role="button"
                tabIndex={0}
              >
                +
              </div>
            </CalendarToggleButton>
          </MenuCard>
          <PartnerSection>
            <DashboardCalendar 
              diaryList={diaryList} 
              StatusIcons={StatusIcons}
              sentMessages={sentMessages}
              receivedMessages={receivedMessages}
              userId={user.id ?? ''}
            />
          </PartnerSection>
          <MenuCard onClick={() => handleFeatureClick("/onboarding")} disabled>
            <MenuTitle>광고입니다</MenuTitle>
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
      <Popup isOpen={showPopup} onClose={() => setShowPopup(false)}>
        <div style={{ whiteSpace: 'pre-line', fontSize: '1rem', fontWeight: 400 }}>
          {`감정 표현만으로 관계가 달라질 수 있을까요?\n이미 12,000쌍의 부부가 리커넥트를 통해 그 답을 찾고있어요`}
        </div>
      </Popup>
      {/* 일정 등록 모달 */}
      {isScheduleModalOpen && (
        <div style={{
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setIsScheduleModalOpen(false)}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, minWidth: 280, maxWidth: 340, boxShadow: '0 4px 16px #0001' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: 0, marginBottom: 16, fontSize: 18, color: '#E64A8D' }}>일정 등록</h3>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 14, color: '#555' }}>날짜</label>
              <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee', marginTop: 4 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 14, color: '#555' }}>일정 내용</label>
              <input type="text" value={scheduleInput} onChange={e => setScheduleInput(e.target.value)} placeholder="예: 결혼기념일" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee', marginTop: 4 }} />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setIsScheduleModalOpen(false)} style={{ background: '#eee', color: '#555', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}>취소</button>
              <button onClick={handleSaveSchedule} style={{ background: '#E64A8D', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}>저장</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
