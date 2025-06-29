// src/pages/Dashboard.tsx (최종 수정)
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import { useDashboardData } from '../hooks/useDashboardData';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationsStore';
import { useEmotionCardNotifications } from '../hooks/useEmotionCardNotifications';

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

import logoImage from '../assets/Logo.png';

const getEmotionByTemperature = (temp: number): string => {
  if (temp > 80) return "타오르는 불꽃 🔥";
  if (temp > 60) return "포근한 햇살 ☀️";
  if (temp > 40) return "미지근한 온기 ☁️";
  if (temp > 20) return "쌀쌀한 바람 🌬️";
  return "얼어붙은 빙하 🧊";
};

const Container = styled.div`
  padding: 1.5rem;
  background-color: #ffffff;
  padding-bottom: 80px;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Logo = styled.img`
  width: 180px;
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, partner, latestDiagnosis, temperature, activeChallenge, isLoading, receivedMessages } = useDashboardData();
  const { checkAuth } = useAuthStore();
  const { fetchNotifications } = useNotificationStore();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading, user, navigate]);

  useEffect(() => {
    if (user && !partner) {
      const interval = setInterval(() => checkAuth({ silent: true }), 5000);
      return () => clearInterval(interval);
    }
  }, [user, partner, checkAuth]);
  
  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

  useEmotionCardNotifications(receivedMessages);

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

  const heartPercent = temperature?.overallScore ?? latestDiagnosis?.score ?? 61;
  const emotion = getEmotionByTemperature(heartPercent);

  return (
    <>
      <Container>
        <Header>
          <Logo src={logoImage} alt="리커넥트 로고" />
          <NotificationBell />
        </Header>
        <TopSection>
          <Left>
            <HeartGauge percentage={heartPercent} size={120} />
          </Left>
          <Right>
            <WelcomeUserSection user={user} heartPercent={heartPercent} emotion={emotion} />
          </Right>
        </TopSection>

        {partner ? (
          <PartnerCard
            partner={partner}
            user={{ nickname: user.nickname ?? '' }}
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
      />
    </>
  );
};

export default Dashboard;
