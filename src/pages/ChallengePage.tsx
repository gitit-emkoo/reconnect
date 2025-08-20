import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Container as BaseContainer } from '../styles/CommonStyles';
import { useNavigate } from 'react-router-dom';
import ActiveChallenge from '../components/challenge/ActiveChallenge';
import ChallengeListModal from '../components/challenge/ChallengeListModal';
import { Challenge } from '../api/challenge';
import challengeApi from '../api/challenge';
import NavigationBar from '../components/NavigationBar';
import TabSwitcher from '../components/common/TabSwitcher';
import PartnerRequiredModal from '../components/common/PartnerRequiredModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import {  isThisWeekKST } from '../utils/date';
import useAuthStore from '../store/authStore';
import ChallengeHistoryDetailModal from '../components/challenge/ChallengeHistoryDetailModal';
import Header from '../components/common/Header';
import { useChallengeData } from '../hooks/useChallengeData';
import { useQueryClient } from '@tanstack/react-query';
// 뱃지 이미지 임포트
import badge1 from '../assets/challenge (1).png';
import badge2 from '../assets/challenge (2).png';
import badge3 from '../assets/challenge (3).png';

const PageContainer = styled(BaseContainer)`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Description = styled.p`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem 1.2rem;
  margin-bottom: 2rem;
`;

const categoryStyles = {
  DAILY_SHARE: {
    bg: '#FFE9C6',
    icon: '💬',
    btnBg: '#FF9800',
    btnColor: '#fff',
    btnText: '챌린지 시작',
  },
  TOGETHER_ACT: {
    bg: '#FFF7DE',
    icon: '🍽️',
    btnBg: '#B48A00',
    btnColor: '#fff',
    btnText: '챌린지 보기',
  },
  EMOTION_EXPR: {
    bg: '#FFE0E7',
    icon: '💗',
    btnBg: '#E64A8D',
    btnColor: '#fff',
    btnText: '챌린지 보기',
  },
  MEMORY_BUILD: {
    bg: '#FFE37B',
    icon: '📸',
    btnBg: '#F7B500',
    btnColor: '#fff',
    btnText: '챌린지 보기',
  },
  SELF_CARE: {
    bg: '#F5D9FF',
    icon: '🧘',
    btnBg: '#A259D9',
    btnColor: '#fff',
    btnText: '챌린지 보기',
  },
  GROW_TOGETHER: {
    bg: '#C6F6F6',
    icon: '🏃',
    btnBg: '#1CC8C8',
    btnColor: '#fff',
    btnText: '챌린지 보기',
  },
};

const CategoryCard = styled.div<{ bg: string }>`
  background: ${({ bg }) => bg};
  border-radius: 1.2rem;
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  box-shadow: 0 2px 8px #0001;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 180px;
`;

const CategoryIcon = styled.div`
  margin-bottom: 0.7rem;
  font-size: 2rem;
`;

const CategoryTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 0.4rem;
  display: flex;
  align-items: center;
`;

const CategoryDescription = styled.p`
  color: #444;
  font-size: 0.97rem;
  margin-bottom: 1.2rem;
  line-height: 1.5;
`;

const CategoryButton = styled.button<{ bg: string; color: string }>`
  background: ${({ bg }) => bg};
  color: ${({ color }) => color};
  border: none;
  border-radius: 0.7rem;
  padding: 0.6rem 1.3rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: auto;
  box-shadow: 0 2px 8px #0001;
  &:hover { opacity: 0.92; }
`;

const HistoryList = styled.div`
  background: #f9fafb;
  border-radius: 1.2rem;
  padding: 2rem 2rem 4rem;
  min-height: 120px;
  display: flex;
  align-items: center;
`;

const HistoryCardMini = styled.div<{ success: boolean }>`
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 95px;
  height: 95px;
  transition: all 0.2s ease-in-out;
  border: 2px solid ${({ success }) => (success ? '#4CAF50' : '#F44336')};

  &:not(:first-child) {
    margin-left: -30px;
  }

  &:hover {
    transform: translateY(-5px) scale(1.05);
    z-index: 10;
  }
`;

const HistoryBadgeImage = styled.img`
  width: 85px;
  height: 85px;
  border-radius: 50%;
  object-fit: cover;
`;

const EmptyText = styled.div`
  color: #aaa;
  text-align: center;
  padding: 2.5rem 0;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 2rem 0 1.5rem 0;
  padding-top: 0.5rem;
`;

const badgeImages = [badge1, badge2, badge3];

const ChallengePage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<Challenge['category'] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historyTab, setHistoryTab] = useState<'success' | 'fail'>('success');
  const [showPartnerRequiredModal, setShowPartnerRequiredModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState('');
  const [showHistoryDetailModal, setShowHistoryDetailModal] = useState(false);
  const [selectedHistoryChallenge, setSelectedHistoryChallenge] = useState<Challenge | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedChallengeTitle, setCompletedChallengeTitle] = useState('');
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [failedChallengeTitle, setFailedChallengeTitle] = useState('');
  const user = useAuthStore(state => state.user);
  const checkAuth = useAuthStore(state => state.checkAuth);
  const hasPartner = !!user?.partner?.id;

  // React Query 훅 사용
  const { 
    activeChallenge, 
    challengeHistory, 
    isLoading, 
    isActiveChallengeLoading,
    isHistoryLoading
  } = useChallengeData();

  // 디버깅 로그
  console.log('ChallengePage - Data state:', {
    hasActiveChallenge: !!activeChallenge,
    activeChallenge,
    challengeHistoryLength: challengeHistory?.completed?.length + challengeHistory?.failed?.length,
    isLoading,
    isActiveChallengeLoading,
    isHistoryLoading
  });

  // 페이지 진입 시 데이터 강제 리페치
  useEffect(() => {
    const initializePage = async () => {
      console.log('ChallengePage - 페이지 초기화 시작');
      
      // 1. 인증 상태 강제 확인
      try {
        await checkAuth();
        console.log('인증 상태 확인 완료');
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
      }
      
      // 2. 사용자 정보가 로드된 후 챌린지 데이터 리페치
      if (user?.coupleId) {
        console.log('ChallengePage - 강제 데이터 리페치 시작');
        
        // 사용자 정보 강제 리페치 (인증 상태 확인)
        try {
          await queryClient.invalidateQueries({ queryKey: ['user'] });
          console.log('사용자 정보 리페치 완료');
        } catch (error) {
          console.error('사용자 정보 리페치 실패:', error);
        }
        
        // 활성 챌린지와 히스토리 리페치
        try {
          await queryClient.invalidateQueries({ queryKey: ['activeChallenge', user.id] });
          await queryClient.invalidateQueries({ queryKey: ['challengeHistory', user.id] });
          console.log('챌린지 데이터 리페치 완료');
        } catch (error) {
          console.error('챌린지 데이터 리페치 실패:', error);
        }
      } else {
        console.log('ChallengePage - coupleId가 없음:', { coupleId: user?.coupleId, userId: user?.id });
      }
    };

    initializePage();
  }, [user?.coupleId, user?.id, queryClient, checkAuth]);

  // 실패 챌린지 확인 함수
  const checkForFailedChallenge = useCallback(async () => {
    if (!user?.couple?.id) return;
    
    try {
      const history = await challengeApi.getChallengeHistory();
      const recentFailed = history.failed[0]; // 가장 최근 실패한 챌린지
      
      if (recentFailed) {
        const modalKey = `challenge_failure_modal_${recentFailed.id}`;
        const hasSeenModal = localStorage.getItem(modalKey);
        
        // 실패한 지 24시간 이내이고 모달을 본 적이 없다면 표시
        const failedAt = new Date(recentFailed.updatedAt!);
        const now = new Date();
        const hoursDiff = (now.getTime() - failedAt.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff <= 24 && !hasSeenModal) {
          setFailedChallengeTitle(recentFailed.title);
          setShowFailureModal(true);
          localStorage.setItem(modalKey, 'true');
        }
      }
    } catch (error) {
      console.error('실패한 챌린지 확인 중 오류:', error);
    }
  }, [user?.couple?.id]);

  // 완료 모달 확인 함수
  const checkForCompletedChallenge = useCallback(async () => {
    if (!user?.couple?.id) return;
    
    try {
      const history = await challengeApi.getChallengeHistory();
      const recentCompleted = history.completed[0]; // 가장 최근 완료된 챌린지
      
      if (recentCompleted) {
        const modalKey = `challenge_completion_modal_${recentCompleted.id}`;
        const hasSeenModal = localStorage.getItem(modalKey);
        
        // 완료된 지 24시간 이내이고 모달을 본 적이 없다면 표시
        const completedAt = new Date(recentCompleted.completedAt!);
        const now = new Date();
        const hoursDiff = (now.getTime() - completedAt.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff <= 24 && !hasSeenModal) {
          setCompletedChallengeTitle(recentCompleted.title);
          setShowCompletionModal(true);
          localStorage.setItem(modalKey, 'true');
        }
      }
    } catch (error) {
      console.error('완료된 챌린지 확인 중 오류:', error);
    }
  }, [user?.couple?.id]);

  useEffect(() => {
    // React Query는 컴포넌트 마운트 시 데이터를 자동으로 로드하므로, 여기서는 데이터 로딩 로직을 제거
    // 페이지 로드 시 완료 모달 확인
    checkForCompletedChallenge();
    checkForFailedChallenge(); // 페이지 로드 시 실패 모달 확인
  }, [checkForCompletedChallenge, checkForFailedChallenge]);

  // 챌린지 완료 처리 함수 (ActiveChallenge에서 호출)
  const handleChallengeComplete = async (completedChallenge: Challenge) => {
    // 즉시 모달 표시 (마지막 완료 버튼을 누른 사용자)
    if (completedChallenge.status === 'COMPLETED') {
      setCompletedChallengeTitle(completedChallenge.title);
      setShowCompletionModal(true);
      
      // 로컬스토리지에 모달 표시 기록
      const modalKey = `challenge_completion_modal_${completedChallenge.id}`;
      localStorage.setItem(modalKey, 'true');
    }
    
    // React Query 캐시 무효화하여 데이터 즉시 업데이트
    await queryClient.invalidateQueries({ queryKey: ['activeChallenge'] });
    await queryClient.invalidateQueries({ queryKey: ['challengeHistory'] });
  };

  const handleCategoryClick = async (category: Challenge['category']) => {
    if (!hasPartner) {
      setShowPartnerRequiredModal(true);
      return;
    }
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSelectChallenge = async (challenge: Challenge) => {
    try {
      await challengeApi.startChallenge(challenge.id);
      setIsModalOpen(false);
      // React Query 캐시 무효화하여 데이터 즉시 업데이트
      await queryClient.invalidateQueries({ queryKey: ['activeChallenge'] });
    } catch (error: any) {
      console.error('챌린지 시작 중 오류 발생:', error);
      
      // 백엔드 에러 메시지 확인 및 분기 처리
      const message = error?.response?.data?.message || '챌린지 시작 중 오류가 발생했습니다.';
      if (message.includes('이미 진행중인 챌린지')) {
        setConfirmModalMessage(message);
        setShowConfirmModal(true);
        setIsModalOpen(false); // 챌린지 선택 모달은 닫기
      } else {
        alert(message); // 그 외의 에러는 alert로 표시
      }
    }
  };

  const handleHistoryCardClick = (challenge: Challenge) => {
    setSelectedHistoryChallenge(challenge);
    setShowHistoryDetailModal(true);
  };

  const currentHistory = historyTab === 'success' ? challengeHistory.completed : challengeHistory.failed;
  
  const isCurrentUserCompleted = !!(
    activeChallenge &&
    ((user?.id === activeChallenge.member1Id && activeChallenge.isCompletedByMember1) ||
      (user?.id === activeChallenge.member2Id && activeChallenge.isCompletedByMember2))
  );
  
  const isWeeklyCompleted = !!activeChallenge?.completedAt && isThisWeekKST(new Date(activeChallenge.completedAt));
  const isChallengeActive = !!activeChallenge && !isWeeklyCompleted;

  const categoryDescriptions = {
    DAILY_SHARE: { name: '데일리 공유', description: '매일의 작은 순간들을 나누며 가까워져요.' },
    TOGETHER_ACT: { name: '함께하는 활동', description: '같이 요리하고, 산책하며 즐거운 시간을 보내세요.' },
    EMOTION_EXPR: { name: '감정 표현', description: '서로의 마음에 귀 기울이는 연습을 해봐요.' },
    MEMORY_BUILD: { name: '추억 쌓기', description: '사진첩을 만들거나, 특별한 날을 기념해보세요.' },
    SELF_CARE: { name: '서로 돌보기', description: '서로를 챙겨주며 애정을 표현하는 시간.' },
    GROW_TOGETHER: { name: '함께 성장', description: '미래를 계획하고, 같이 목표를 세워봐요.' },
  };

  return (
    <>
    <Header title="챌린지" />
      <PageContainer>
          <Description>
            파트너와 함께 즐거운 챌린지를 통해 관계를 더욱 단단하게 만들어보세요.
          </Description>
        <SectionTitle style={{ marginTop: '1rem', paddingTop: 0, borderTop: 'none' }}>
          🔥 진행 중인 챌린지
        </SectionTitle>
        <ActiveChallenge
          challenge={activeChallenge || null}
          isCurrentUserCompleted={isCurrentUserCompleted}
          isWeeklyCompleted={isWeeklyCompleted}
          isLoading={isLoading}
          onComplete={handleChallengeComplete}
        />

        <SectionTitle>새로운 챌린지 시작하기</SectionTitle>
        <CategoryGrid>
          {Object.entries(categoryStyles).map(([key, value]) => (
            <CategoryCard key={key} bg={value.bg}>
              <CategoryIcon>{value.icon}</CategoryIcon>
              <CategoryTitle>{categoryDescriptions[key as Challenge['category']].name}</CategoryTitle>
              <CategoryDescription>{categoryDescriptions[key as Challenge['category']].description}</CategoryDescription>
              <CategoryButton
                bg={value.btnBg}
                color={value.btnColor}
                onClick={() => handleCategoryClick(key as Challenge['category'])}
              >
                {value.btnText}
              </CategoryButton>
            </CategoryCard>
          ))}
        </CategoryGrid>

        <SectionTitle>챌린지 기록</SectionTitle>
        <TabSwitcher
          tabs={[
            { key: 'success', label: `성공 (${challengeHistory.completed.length})` },
            { key: 'fail', label: `실패 (${challengeHistory.failed.length})` },
          ]}
          activeKey={historyTab}
          onChange={key => setHistoryTab(key as 'success' | 'fail')}
        />
        <HistoryList>
          {currentHistory.length > 0 ? (
            currentHistory.map((c, i) => (
              <HistoryCardMini key={i} onClick={() => handleHistoryCardClick(c)} success={historyTab === 'success'}>
                <HistoryBadgeImage src={badgeImages[i % badgeImages.length] || badge1} alt={`${c.title} 뱃지`} />
              </HistoryCardMini>
            ))
          ) : (
            <EmptyText>
              {historyTab === 'success' 
                ? '아직 성공한 챌린지가 없어요.' 
                : '아직 실패한 챌린지가 없어요. 이번 주 챌린지를 완료해보세요! 💪'
              }
            </EmptyText>
          )}
        </HistoryList>
      </PageContainer>
      
      {/* 챌린지 완료 축하 모달 */}
      <ConfirmationModal
        isOpen={showCompletionModal}
        onRequestClose={() => setShowCompletionModal(false)}
        onConfirm={() => {
          setShowCompletionModal(false);
          navigate('/community');
        }}
        title="🎉 챌린지 성공!"
        message={`${completedChallengeTitle} 챌린지를 성공했습니다!`}
        confirmButtonText="자랑하러 가기"
        showCancelButton={true}
        cancelButtonText="닫기"
      />

      {/* 챌린지 실패 알림 모달 */}
      <ConfirmationModal
        isOpen={showFailureModal}
        onRequestClose={() => setShowFailureModal(false)}
        onConfirm={() => {
          setShowFailureModal(false);
          setHistoryTab('fail'); // 실패 탭으로 이동
        }}
        title="😔 챌린지 실패"
        message={`${failedChallengeTitle} 챌린지가 시간 초과로 실패했습니다. 다음 주에 다시 도전해보세요!`}
        confirmButtonText="실패 기록 보기"
        showCancelButton={true}
        cancelButtonText="닫기"
      />
      
      {selectedCategory && (
        <ChallengeListModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          category={selectedCategory}
          onSelect={handleSelectChallenge}
          isChallengeActive={isChallengeActive}
        />
      )}
      <PartnerRequiredModal open={showPartnerRequiredModal} onClose={() => setShowPartnerRequiredModal(false)} />
      <ConfirmationModal
        isOpen={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          // Placeholder for actual confirm action
          setShowConfirmModal(false);
        }}
        message={confirmModalMessage}
        showCancelButton={false}
      />
      <ChallengeHistoryDetailModal
        isOpen={showHistoryDetailModal}
        onClose={() => setShowHistoryDetailModal(false)}
        challenge={selectedHistoryChallenge}
      />
      <NavigationBar />
    </>
  );
};

export default ChallengePage; 