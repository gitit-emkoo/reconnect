import React, { useState } from 'react';
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
  max-width: 740px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  font-size: 1.6rem;
  margin-bottom: 0.8rem;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 1.6rem;
`;

const Summary = styled.div`
  background: #eef2ff;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  font-size: 0.95rem;
  line-height: 1.6;
`;

const Graph = styled.div`
  display: flex;
  gap: 0.7rem;
  align-items: flex-end;
  height: 160px;
  margin-bottom: 2rem;
`;

const Bar = styled.div<{ height: number }>`
  flex: 1;
  background: #4a6cf7;
  border-radius: 8px 8px 0 0;
  position: relative;
  opacity: 0.8;
  height: ${({ height }) => height}px;
  
  &::after {
    content: attr(data-label);
    position: absolute;
    bottom: -1.2rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.8rem;
    color: #444;
  }
`;

const Tags = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const Tag = styled.div`
  background: #f0f2fa;
  padding: 0.6rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #4455aa;
  font-weight: 500;
`;

const ButtonBox = styled.div`
  text-align: center;
`;

const Button = styled.button`
  background: #4a6cf7;
  color: white;
  padding: 0.9rem 1.8rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ToggleButton = styled.button`
  background: #f0f2fa;
  color: #4455aa;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  width: 100%;
  margin-bottom: 1.5rem;
  
  &:hover {
    background: #e8ebf7;
  }
`;

const ReportContent = styled.div<{ isOpen: boolean }>`
  max-height: ${({ isOpen }) => isOpen ? '2000px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  opacity: ${({ isOpen }) => isOpen ? '1' : '0'};
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
`;

interface EmotionData {
  label: string;
  height: number;
}

const TrackPage: React.FC = () => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  
  const emotionData: EmotionData[] = [
    { label: '행복', height: 100 },
    { label: '평온', height: 130 },
    { label: '불안', height: 85 },
    { label: '무기력', height: 70 },
    { label: '분노', height: 50 },
    { label: '설렘', height: 60 },
  ];

  const tags = ['#가족', '#식사', '#야외활동', '#업무', '#침묵'];

  const handleToggleReport = () => {
    setIsReportOpen(!isReportOpen);
  };

  const handleSavePDF = () => {
    // PDF 저장 로직 구현
    console.log('PDF 저장 클릭');
  };

  return (
    <>
      <Header title="감정 트랙(감정일기 리포트)" />
      <BackButton />
      <Container>
        <Wrap>
          <Title>📘 감정트랙 리포트</Title>
          <Description>
            감정일기를 분석한 월간 리포트를 확인해보세요
          </Description>
          
          {/* 토글 버튼 */}
          <ToggleButton onClick={handleToggleReport}>
            {isReportOpen ? '📁 샘플 리포트 접기' : '📂 6월 감정트랙 샘플 보기'}
          </ToggleButton>

          {/* 리포트 내용 */}
          <ReportContent isOpen={isReportOpen}>
            <Description>
              2025년 6월 감정일기 9건을 기반으로, 감정 흐름이 요약되었습니다
            </Description>
            
            {/* 요약문 */}
            <Summary>
              💛 행복은 가족, 산책, 음식 트리거와 함께 자주 등장했어요<br/>
              💙 불안은 평일 오전 업무 시작 시간에 반복되었어요<br/>
              📈 감정 회복 곡선이 점차 완만해지는 흐름을 보여요
            </Summary>

            {/* 감정 항목별 빈도 그래프 */}
            <Graph>
              {emotionData.map((emotion, index) => (
                <Bar 
                  key={index} 
                  height={emotion.height} 
                  data-label={emotion.label}
                />
              ))}
            </Graph>

            {/* 반복된 트리거 태그 */}
            <Tags>
              {tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </Tags>

            {/* 저장 버튼 */}
            <ButtonBox>
              <Button onClick={handleSavePDF}>
                📥 PDF로 저장하기
              </Button>
            </ButtonBox>
          </ReportContent>
        </Wrap>
      </Container>
      <NavigationBar />
    </>
  );
};

export default TrackPage;