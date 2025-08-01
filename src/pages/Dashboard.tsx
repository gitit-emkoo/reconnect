// src/pages/Dashboard.tsx (최종 수정)
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import { useDashboardData } from '../hooks/useDashboardData';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationsStore';
import { formatInKST } from '../utils/date';
import { scheduleApi, Schedule } from '../api/schedule';
import NavigationBar from '../components/NavigationBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmationModal from '../components/common/ConfirmationModal';
import NotificationBell from '../components/NotificationBell';
import WelcomeUserSection from "../components/Dashboard/WelcomeUserSection";
import PartnerCard from '../components/Dashboard/PartnerCard';
import PartnerConnectCard from '../components/Dashboard/PartnerConnectCard';
import { InviteModal } from "../components/Invite/InviteModal";
import InviteCodeInputModal from '../components/Invite/InviteCodeInputModal';
import HeartGauge from '../components/Dashboard/HeartGauge';
import MainMenu from '../components/Dashboard/MainMenu';
import DashboardCalendar from '../components/Dashboard/DashboardCalendar';
import Popup from '../components/common/Popup';
import logoImage from '../assets/typologo.png';
import { useReportData } from '../hooks/useReportData';
import SkeletonHeartGauge from '../components/common/SkeletonHeartGauge';
import { userService } from '../services/userService';
import { User } from '../types/user';

const getEmotionByTemperature = (temp: number): string => {
  if (temp > 80) return "타오르는 불꽃 🔥";
  if (temp > 60) return "포근한 햇살 ☀️";
  if (temp > 40) return "미지근한 온기 ☁️";
  if (temp > 20) return "쌀쌀한 바람 🌬️";
  return "얼어붙은 빙하 🧊";
};

const Container = styled.div`
  padding: 1.5rem 1.5rem;
  background-color: #ffffff;
  padding-bottom: 40px;
  height: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Logo = styled.img`
  width: 130px;
  height: auto;
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

const StatusCard = styled.div`
  width: 100%;
  padding: 1.2rem;
  border-radius: 1rem;
  border: 1px solid #E64A8D;
  background: #fff;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  min-height: 80px;
  text-align: left;
  margin-bottom: 1rem; 
  position: relative; 
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

const StatusDot = styled.span<{ color: string }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const StatusIcons = ({ hasEmotionDiary, hasSentEmotionCard, hasReceivedEmotionCard }: { hasEmotionDiary: boolean; hasSentEmotionCard: boolean; hasReceivedEmotionCard: boolean; }) => (
  <StatusIconsContainer>
    {hasEmotionDiary && <StatusDot color="#FF69B4" title="감정일기 작성" />}
    {hasSentEmotionCard && <StatusDot color="#FFA500" title="감정카드 보냄" />}
    {hasReceivedEmotionCard && <StatusDot color="#32CDFF" title="감정카드 받음" />}
  </StatusIconsContainer>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    user, 
    partner, 
    activeChallenge, 
    isLoading, 
    receivedMessages, 
    diaryList,
    sentMessages,
  } = useDashboardData();
  const { fetchNotifications } = useNotificationStore();
  const { latestScore, loading: reportLoading, hasLoadedOnce } = useReportData();
  const { isAuthenticated } = useAuthStore();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);

  // 팝업 관련 상태 추가
  const today = new Date();
  const todayStr = formatInKST(today, 'yyyyMMdd');
  const todayKey = 'main_dashboard_popup';
  const hideToday = typeof window !== 'undefined' && localStorage.getItem(`${todayKey}_${todayStr}`) === 'true';
  const [showPopup, setShowPopup] = useState(!hideToday);
  const todayString = formatInKST(today, 'yyyy-MM-dd');

  // 일정 관련 상태
  const [scheduleMap, setScheduleMap] = useState<Record<string, string[]>>({});
  const [scheduleInput, setScheduleInput] = useState('');
  const [scheduleDate, setScheduleDate] = useState(formatInKST(new Date(), 'yyyy-MM-dd'));
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  
  // 스케줄 데이터 로드
  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const schedules = await Promise.race([
          scheduleApi.findAll(),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Schedule load timeout')), 5000)
          )
        ]) as Schedule[];
        const scheduleMapData: Record<string, string[]> = {};
        schedules.forEach((schedule: Schedule) => {
          if (!scheduleMapData[schedule.date]) {
            scheduleMapData[schedule.date] = [];
          }
          scheduleMapData[schedule.date].push(schedule.content);
        });
        setScheduleMap(scheduleMapData);
      } catch (error) {
        console.error('스케줄 로드 실패:', error);
      }
    };
    if (user) loadSchedules();
  }, [user]);

  useEffect(() => {
    if (location.state?.fromSocialLogin) {
      setWelcomeModalOpen(true);
      // 모달이 다시 뜨지 않도록 state를 정리합니다.
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading, user, navigate]);

  useEffect(() => {
    if (user && !partner) {
      const interval = setInterval(async () => {
        try {
          // 파트너 연결 상태 체크 (5초마다로 변경, 타임아웃 추가)
          const updatedUser = await Promise.race([
            userService.getMyProfile(),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Partner check timeout')), 3000)
            )
          ]) as User;
          if (updatedUser.partner?.id || updatedUser.couple?.id) {
            // 파트너가 연결되면 즉시 전역 상태 업데이트
            useAuthStore.getState().setUser(updatedUser);
            console.log('[Dashboard] 파트너 연결 감지 - 전역 상태 업데이트');
          }
        } catch (e) {
          // 무시
        }
      }, 5000); // 2초에서 5초로 변경
      return () => clearInterval(interval);
    }
  }, [user, partner]);
  
  useEffect(() => {
    if (user && isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications, isAuthenticated]);

  // 읽지 않은 알림 개수만 더 자주 체크 (가벼운 API 호출)
  useEffect(() => {
    if (user && isAuthenticated) {
      const { fetchUnreadCount } = useNotificationStore.getState();
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 5000);
      return () => clearInterval(interval);
    }
  }, [user, isAuthenticated]);

  // useEmotionCardNotifications(receivedMessages); // 중복 호출 제거
  
  // 필수 데이터만 로딩 체크 (진단 결과)
  if (isLoading || !user) {
    return <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><LoadingSpinner /></Container>;
  }
  
  const handleFeatureClick = (path: string, requiresPartner: boolean = false) => {
    if (requiresPartner && !partner) {
      setShowDiscardModal(true);
    } else {
      navigate(path);
    }
  };

  const heartPercent = latestScore ?? 0;
  const emotion = getEmotionByTemperature(heartPercent);
  
  const getDiaryStatusForDate = (dateString: string) => ({
    hasEmotionDiary: diaryList.some(d => d.date === dateString),
    hasSentEmotionCard: sentMessages.some(msg => formatInKST(msg.createdAt, 'yyyy-MM-dd') === dateString),
    hasReceivedEmotionCard: receivedMessages.some(msg => formatInKST(msg.createdAt, 'yyyy-MM-dd') === dateString),
  });

  const todayStatus = getDiaryStatusForDate(todayString);
  const todaySchedules = scheduleMap[todayString] || [];
  const todayScheduleText = todaySchedules.length === 0
    ? '오늘의 일정을 등록해보세요'
    : todaySchedules.length === 1
      ? todaySchedules[0]
      : `${todaySchedules[0]} 외 ${todaySchedules.length - 1}개 일정`;

  // 일정 추가
  const handleAddSchedule = async () => {
    if (!scheduleInput.trim()) return;
    try {
      await scheduleApi.create({ date: scheduleDate, content: scheduleInput.trim() });
      setScheduleMap(prev => ({ ...prev, [scheduleDate]: [...(prev[scheduleDate] || []), scheduleInput.trim()] }));
      setScheduleInput('');
    } catch (error) { console.error('일정 추가 실패:', error); }
  };

  // 일정 삭제
  const handleDeleteSchedule = async (date: string, idx: number) => {
    try {
      const schedulesOnDate = await scheduleApi.findByDate(date);
      if (schedulesOnDate[idx]) {
        await scheduleApi.remove(schedulesOnDate[idx].id);
        setScheduleMap(prev => {
          const newArr = [...prev[date]];
          newArr.splice(idx, 1);
          return { ...prev, [date]: newArr };
        });
      }
    } catch (error) { console.error('일정 삭제 실패:', error); }
  };
  
  const renderScheduleModal = () => {
    // ... 일정 등록 모달 구현 (이전 코드 참고)
    const [selectedYear, selectedMonth, selectedDay] = scheduleDate.split('-').map(Number);
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
    const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
    const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
    const dayOptions = Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1);

    const handleDateChange = (type: 'year' | 'month' | 'day', value: number) => {
        let newYear = selectedYear, newMonth = selectedMonth, newDay = selectedDay;
        if (type === 'year') newYear = value;
        else if (type === 'month') newMonth = value;
        else if (type === 'day') newDay = value;
        const maxDays = getDaysInMonth(newYear, newMonth);
        if (newDay > maxDays) newDay = maxDays;
        setScheduleDate(`${newYear}-${String(newMonth).padStart(2, '0')}-${String(newDay).padStart(2, '0')}`);
    };

    return (
      isScheduleModalOpen && (
        <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setIsScheduleModalOpen(false)}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, minWidth: 280, maxWidth: 340, boxShadow: '0 4px 16px #0001', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <span onClick={() => setIsScheduleModalOpen(false)} style={{ position: 'absolute', top: 12, right: 12, cursor: 'pointer', fontSize: 22, fontWeight: 700, lineHeight: 1 }} aria-label="Close">✕</span>
            <h3 style={{ margin: 0, marginBottom: 16, fontSize: 18, color: '#E64A8D' }}>일정 등록</h3>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 14, color: '#555', display: 'block', marginBottom: 4 }}>날짜</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select value={selectedYear} onChange={(e) => handleDateChange('year', Number(e.target.value))} style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #eee', fontSize: 14, backgroundColor: '#fff' }}>
                  {yearOptions.map(year => <option key={year} value={year}>{year}년</option>)}
                </select>
                <select value={selectedMonth} onChange={(e) => handleDateChange('month', Number(e.target.value))} style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #eee', fontSize: 14, backgroundColor: '#fff' }}>
                  {monthOptions.map(month => <option key={month} value={month}>{month}월</option>)}
                </select>
                <select value={selectedDay} onChange={(e) => handleDateChange('day', Number(e.target.value))} style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #eee', fontSize: 14, backgroundColor: '#fff' }}>
                  {dayOptions.map(day => <option key={day} value={day}>{day}일</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 14, color: '#555' }}>일정 내용</label>
              <input type="text" value={scheduleInput} onChange={e => setScheduleInput(e.target.value)} placeholder="예: 결혼기념일" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee', marginTop: 4 }} />
            </div>
            <button onClick={handleAddSchedule} style={{ background: '#E64A8D', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', width: '100%', fontWeight: 600, fontSize: 16 }}>추가</button>
            {(scheduleMap[scheduleDate] && scheduleMap[scheduleDate].length > 0) && (
              <div style={{ marginTop: 18 }}>
                <div style={{ fontWeight: 600, marginBottom: 6, color: '#E64A8D' }}>등록된 일정</div>
                {scheduleMap[scheduleDate].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb', borderRadius: 6, padding: '6px 10px', marginBottom: 6 }}>
                    <span style={{ fontSize: 15 }}>{item}</span>
                    <span style={{ cursor: 'pointer', marginLeft: 8 }} onClick={() => handleDeleteSchedule(scheduleDate, idx)}>🗑️</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )
    );
  };
  

  return (
    <>
      <Container>
        <Header>
          <Logo src={logoImage} alt="리커넥트 로고" onClick={() => navigate('/')} />
          <NotificationBell />
        </Header>
        <TopSection>
          <Left>
            {(reportLoading && !hasLoadedOnce)
              ? <SkeletonHeartGauge size={120} />
              : <HeartGauge percentage={latestScore ?? 0} size={120} />
            }
          </Left>
          <Right>
            <WelcomeUserSection user={user} heartPercent={latestScore ?? 0} emotion={emotion} />
          </Right>
        </TopSection>

        {partner ? (
          <PartnerCard
            partner={partner}
            user={{ 
              nickname: user.nickname ?? '',
              profileImageUrl: user.profileImageUrl
            }}
            coupleCreatedAt={user.couple?.createdAt}
            activeChallengeTitle={activeChallenge?.title}
          />
        ) : (
          <PartnerConnectCard
            onShareClick={() => setIsShareModalOpen(true)}
            onInputClick={() => setIsInputModalOpen(true)}
          />
        )}

        <MainMenu onFeatureClick={handleFeatureClick} hasPartner={!!partner} />

        <StatusCard>
          <DateInfo>
            <DateText>
              {formatInKST(today, 'yyyy-MM-dd')}
            </DateText>
            <ScheduleText>
              {todayScheduleText}
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
            onClick={() => { setScheduleDate(todayString); setIsScheduleModalOpen(true); }}
            role="button"
            tabIndex={0}
          >
            +
          </div>
        </StatusCard>
        
        <DashboardCalendar 
          diaryList={diaryList} 
          StatusIcons={StatusIcons}
          sentMessages={sentMessages}
          receivedMessages={receivedMessages}
          userId={user.id}
          scheduleMap={scheduleMap}
          onDeleteSchedule={handleDeleteSchedule}
          onDateClick={setScheduleDate}
        />
        


      </Container>
      <NavigationBar isSolo={!partner} />
      {isShareModalOpen && <InviteModal onClose={() => setIsShareModalOpen(false)} />}
      {isInputModalOpen && <InviteCodeInputModal onClose={() => setIsInputModalOpen(false)} />}
      <ConfirmationModal
        isOpen={showDiscardModal}
        onRequestClose={() => setShowDiscardModal(false)}
        message="파트너 연결이 필요한 기능입니다. 파트너를 연결해주세요."
        onConfirm={() => setShowDiscardModal(false)}
        confirmButtonText="확인"
        showCancelButton={false}
      />
      {renderScheduleModal()}

      <ConfirmationModal
        isOpen={welcomeModalOpen}
        onRequestClose={() => setWelcomeModalOpen(false)}
        message={`${user?.nickname}님, 다시 찾아주셔서 감사해요! 마지막으로 진단했던 관계 온도를 불러왔어요.`}
        onConfirm={() => setWelcomeModalOpen(false)}
        showCancelButton={false}
        confirmButtonText="확인"
      />

      {/* 팝업 컴포넌트 추가 */}
      <Popup
        isOpen={showPopup && !!user}
        onClose={() => setShowPopup(false)}
        title="무료진단 혜택받기"
        emoji="🎁"
        description={<>
          결혼생활 진단은 <br /> 건강한 부부관계를 위한 <br />첫걸음 입니다. <br />
          지금 바로 시작하세요!
        </>}
        buttonText="❤️ 무료진단 받기"
        onButtonClick={() => { setShowPopup(false); navigate('/expert/self-diagnosis'); }}
        todayKey={todayKey}
      />
    </>
  );
};

export default Dashboard;
