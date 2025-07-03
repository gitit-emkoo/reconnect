import React from 'react';
import Header from '../components/common/Header';
import styled from 'styled-components';
import NavigationBar from '../components/NavigationBar';
import BackButton from '../components/common/BackButton';

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
  font-size: 1.4rem;
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
  const handleSingleReport = () => {
    // 단일 리포트 구매 로직
    console.log('단일 리포트 구매 클릭');
  };

  const handleSubscribe = () => {
    // 구독 페이지로 이동 로직
    console.log('구독하기 클릭');
  };

  return (
    <>
      <Header title="감정 트랙(감정일기 리포트)" />
      <BackButton />
      <Container>
        <Wrap>
          <Emoji>🔒</Emoji>
          <Title>AI가 감정 리포트를 완성했어요</Title>
          <Description>
            당신이 남긴 감정일기를 분석해<br/>
            한 달간의 감정 흐름이 정리되어 있어요.<br/>
            하지만, 이 리포트는 아직 열람할 수 없습니다.
          </Description>
          
          {/* 흐림 처리된 리포트 미리보기 */}
          <BlurPreview>
            💛 행복은 가족, 산책, 음식 트리거와 함께 자주 등장했어요<br/>
            💙 불안은 평일 오전 업무 시작 시간에 반복되었어요<br/>
            📈 감정 회복 곡선이 점차 완만해지는 흐름을 보여요
          </BlurPreview>
          
          {/* CTA 버튼들 */}
          <CtaBox>
            <Button variant="blue" onClick={handleSingleReport}>
              📘 ₩1,000으로 이번 리포트 열람
            </Button>
            <Button variant="purple" onClick={handleSubscribe}>
              💙 리커넥트케어 전체 구독하기
            </Button>
          </CtaBox>
        </Wrap>
      </Container>
      <NavigationBar />
    </>
  );
};

export default TrackPage;