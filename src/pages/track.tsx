import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import styled from 'styled-components';
import NavigationBar from '../components/NavigationBar';
import BackButton from '../components/common/BackButton';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/common/ConfirmationModal';
import useAuthStore from '../store/authStore';

const Container = styled.div`
  background-color: #f6f8fb;
  min-height: 100vh;
  padding: 2rem;
  padding-bottom: 70px; /* NavigationBar 높이만큼 패딩 */
  font-family: 'Pretendard', sans-serif;
  color: #222;
`;

const Wrap = styled.div`
  max-width: 720px;
  margin: 0 auto;
  background: white;
  padding: 2.4rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  text-align: center;
`;

const Emoji = styled.div`
  font-size: 2.6rem;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.6rem;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 1.6rem;
`;

const BlurPreview = styled.div`
  background: #eef2ff;
  padding: 1.5rem;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #888;
  filter: blur(3px);
  margin-bottom: 2rem;
`;

const CtaBox = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant: 'blue' | 'purple' }>`
  padding: 0.9rem 1.6rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  
  ${({ variant }) => {
    switch (variant) {
      case 'blue':
        return `
          background: #aed4ff;
          color: #333;
        `;
      case 'purple':
        return `
          background: linear-gradient(to right, #8367ff, #da86f7);
          color: white;
        `;
      default:
        return '';
    }
  }}
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const TrackPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  // 구독자일 경우 트랙 리포트 페이지로 리다이렉트
  useEffect(() => {
    if (user?.subscriptionStatus === 'SUBSCRIBED') {
      navigate('/published-track-reports');
    }
  }, [user, navigate]);

  // 구독자가 아닌 경우에만 현재 페이지 렌더링
  if (user?.subscriptionStatus === 'SUBSCRIBED') {
    return null; // 리다이렉트 중이므로 아무것도 렌더링하지 않음
  }

  const handleSubscribe = () => {
    navigate('/subscribe');
    console.log('구독하기 클릭');
  };

  const handleModalConfirm = () => {
    setModalOpen(false);
    navigate('/subscribe');
  };

  return (
    <>
      <Header title="감정 일기 분석 리포트" />
      <BackButton />
      <Container>
        <Wrap>
          <Emoji>🔒</Emoji>
          <Title>AI가 월간 감정 흐름을<br/>분석했어요</Title>
          <Description>
          나의 감정 일기를 AI가 분석해, <br/>
          한 달간의 감정 흐름을 리포트로<br/>
          정리했어요.<br/>
          감정 회고 ,상담 ,자기 돌봄에 중요한 데이터입니다.
          </Description>
          
          {/* 흐림 처리된 리포트 미리보기 */}
          <BlurPreview>
            💛 행복은 가족, 산책, 음식 트리거와 함께 자주 등장했어요<br/>
            💙 불안은 평일 오전 업무 시작 시간에 반복되었어요<br/>
            📈 감정 회복 곡선이 점차 완만해지는 흐름을 보여요
          </BlurPreview>
          
          {/* CTA 버튼들 */}
          <CtaBox>
            
            <Button variant="purple" onClick={handleSubscribe}>
              💙 리커넥트케어
            </Button>
          </CtaBox>
        </Wrap>
        <ConfirmationModal
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          onConfirm={handleModalConfirm}
          message="리커넥트 케어 무료 이벤트 중입니다. 리커넥트케어 보러가기"
          confirmButtonText="이벤트 보러가기"
          showCancelButton={false}
        />
      </Container>
      <NavigationBar />
    </>
  );
};

export default TrackPage;