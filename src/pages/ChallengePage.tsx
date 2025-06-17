import React from 'react';
import styled from 'styled-components';
import ActiveChallenge from '../components/challenge/ActiveChallenge';
import ChallengeListModal from '../components/challenge/ChallengeListModal';
import { Challenge } from '../api/challenge';
import challengeApi from '../api/challenge';
import NavigationBar from '../components/NavigationBar';
import TabSwitcher, { Tab } from '../components/common/TabSwitcher';
import PartnerRequiredModal from '../components/common/PartnerRequiredModal';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: #666;
  font-size: 1rem;
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

const ActiveChallengeCard = styled.div`
  background: #f1f3f7;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const HistoryList = styled.div`
  background: #f9fafb;
  border-radius: 1.2rem;
  padding: 2rem 1.5rem;
  min-height: 120px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.2rem;
`;

const HistoryItemCard = styled.div<{ success?: boolean }>`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px #0001;
  padding: 1.3rem 1.1rem 1.1rem 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-left: 6px solid ${props => props.success ? '#7D5FFF' : '#FF6B81'};
  position: relative;
`;

const HistoryTitle = styled.div`
  font-size: 1.08rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
`;

const HistoryDesc = styled.div`
  font-size: 0.97rem;
  color: #666;
  margin-bottom: 0.7rem;
`;

const HistoryDate = styled.div`
  font-size: 0.88rem;
  color: #aaa;
  margin-top: 0.2rem;
`;

const StatusBadge = styled.span<{ success?: boolean }>`
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  background: ${props => props.success ? '#7D5FFF' : '#FF6B81'};
  border-radius: 0.7rem;
  padding: 0.18rem 0.8rem;
  margin-left: 0.6rem;
`;

const HistoryIcon = styled.span<{ success?: boolean }>`
  font-size: 1.25rem;
  margin-right: 0.5rem;
  color: ${props => props.success ? '#7D5FFF' : '#FF6B81'};
`;

const EmptyText = styled.div`
  color: #aaa;
  text-align: center;
  padding: 2.5rem 0;
`;

const ChallengePage: React.FC = () => {
  const [activeChallenge, setActiveChallenge] = React.useState<Challenge | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<Challenge['category'] | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [hasPartner, setHasPartner] = React.useState(false);
  const [historyTab, setHistoryTab] = React.useState<'success' | 'fail'>('success');
  const [challengeHistory, setChallengeHistory] = React.useState<{ completed: Challenge[]; failed: Challenge[] }>({ completed: [], failed: [] });
  const [showPartnerRequiredModal, setShowPartnerRequiredModal] = React.useState(false);

  // 파트너 연결 상태 확인
  React.useEffect(() => {
    checkPartnerStatus();
  }, []);

  // 활성 챌린지 로드
  React.useEffect(() => {
    loadActiveChallenge();
  }, []);

  React.useEffect(() => {
    // 챌린지 히스토리 불러오기
    const loadHistory = async () => {
      try {
        const data = await challengeApi.getChallengeHistory();
        setChallengeHistory(data);
      } catch (error) {
        console.error('챌린지 히스토리 로드 중 오류 발생:', error);
      }
    };
    loadHistory();
  }, []);

  const checkPartnerStatus = async () => {
    try {
      // TODO: 파트너 연결 상태 확인 API 호출
      const hasPartner = true; // 임시 값
      setHasPartner(hasPartner);
    } catch (error) {
      console.error('파트너 상태 확인 중 오류 발생:', error);
    }
  };

  const loadActiveChallenge = async () => {
    try {
      const challenge = await challengeApi.getActiveChallenge();
      setActiveChallenge(challenge);
    } catch (error) {
      console.error('활성 챌린지 로드 중 오류 발생:', error);
    }
  };

  const handleCategoryClick = (category: Challenge['category']) => {
    if (!hasPartner) {
      setShowPartnerRequiredModal(true);
      return;
    }
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSelectChallenge = async (challenge: Challenge) => {
    try {
      await challengeApi.startChallenge(challenge.templateId);
      await loadActiveChallenge();
    } catch (error) {
      alert('챌린지 시작에 실패했습니다.');
    }
  };

  const categories: Array<{
    type: Challenge['category'];
    title: string;
    description: string;
  }> = [
    {
      type: 'DAILY_SHARE',
      title: '일상 공유',
      description: '작은 말 한마디가 큰 정서적 연결을 만듭니다.',
    },
    {
      type: 'TOGETHER_ACT',
      title: '함께 하기',
      description: '공동 활동을 통해 정서적 유대감을 키우는 주간.',
    },
    {
      type: 'EMOTION_EXPR',
      title: '감정 표현',
      description: '말로 표현하는 감정은 마음을 더욱 가깝게 합니다',
    },
    {
      type: 'MEMORY_BUILD',
      title: '기억 쌓기',
      description: '추억은 감정을 단단하게 붙들어주는 접착제입니다',
    },
    {
      type: 'SELF_CARE',
      title: '마음 돌보기',
      description: '내 마음을 먼저 살피는 것이 관계 회복의 시작입니다',
    },
    {
      type: 'GROW_TOGETHER',
      title: '함께 성장',
      description: '같은 방향을 보는 것이 관계의 본질입니다',
    },
  ];

  const historyTabs: Tab[] = [
    { key: 'success', label: '성공한 챌린지' },
    { key: 'fail', label: '실패한 챌린지' },
  ];

  return (
    <PageContainer>
      <Header>
        <Title>챌린지</Title>
        <Description>
          파트너와 함께 다양한 챌린지에 도전하며 더 특별한 관계를 만들어보세요.
        </Description>
      </Header>

      <ActiveChallengeCard>
        {activeChallenge ? (
          <ActiveChallenge
            challenge={activeChallenge}
            onComplete={loadActiveChallenge}
            isCurrentUserCompleted={activeChallenge.isCompletedByMember1}
          />
        ) : (
          <span style={{ color: '#888', fontSize: '1.1rem' }}>
            진행중인 챌린지가 없습니다
          </span>
        )}
      </ActiveChallengeCard>

      <CategoryGrid>
        {categories.map(category => {
          const style = categoryStyles[category.type];
          return (
            <CategoryCard
              key={category.type}
              bg={style.bg}
            >
              <CategoryIcon>{style.icon}</CategoryIcon>
              <CategoryTitle>{category.title}</CategoryTitle>
              <CategoryDescription>{category.description}</CategoryDescription>
              <CategoryButton
                bg={style.btnBg}
                color={style.btnColor}
                onClick={() => handleCategoryClick(category.type)}
              >
                {style.btnText}
              </CategoryButton>
            </CategoryCard>
          );
        })}
      </CategoryGrid>

      {selectedCategory && (
        <ChallengeListModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          category={selectedCategory}
          onSelectChallenge={handleSelectChallenge}
        />
      )}

      {/* 챌린지 히스토리 탭 */}
      <TabSwitcher
        tabs={historyTabs}
        activeKey={historyTab}
        onChange={(key) => setHistoryTab(key as 'success' | 'fail')}
      />
      <HistoryList>
        {historyTab === 'success' ? (
          challengeHistory.completed.length > 0 ? (
            challengeHistory.completed.map(item => (
              <HistoryItemCard key={item.id} success>
                <HistoryTitle>
                  <HistoryIcon success>🏆</HistoryIcon>
                  {item.title}
                  <StatusBadge success>성공</StatusBadge>
                </HistoryTitle>
                <HistoryDesc>{item.description}</HistoryDesc>
                <HistoryDate>완료일: {item.completedAt ? item.completedAt.slice(0, 10) : '-'}</HistoryDate>
              </HistoryItemCard>
            ))
          ) : (
            <EmptyText>성공한 챌린지 내역이 없습니다.</EmptyText>
          )
        ) : (
          challengeHistory.failed.length > 0 ? (
            challengeHistory.failed.map(item => (
              <HistoryItemCard key={item.id}>
                <HistoryTitle>
                  <HistoryIcon>💔</HistoryIcon>
                  {item.title}
                  <StatusBadge>실패</StatusBadge>
                </HistoryTitle>
                <HistoryDesc>{item.description}</HistoryDesc>
                <HistoryDate>기간 만료</HistoryDate>
              </HistoryItemCard>
            ))
          ) : (
            <EmptyText>실패한 챌린지 내역이 없습니다.</EmptyText>
          )
        )}
      </HistoryList>
      <NavigationBar />
      <PartnerRequiredModal
        open={showPartnerRequiredModal}
        onClose={() => setShowPartnerRequiredModal(false)}
      />
    </PageContainer>
  );
};

export default ChallengePage; 