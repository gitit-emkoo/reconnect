import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import BackButton from '../components/common/BackButton';
import ActionButton from '../components/common/ActionButton';
import { diagnosisQuestions, MAX_SCORE } from "../config/diagnosisQuestions";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: white;
  position: relative;
`;

const ImageSection = styled.div`
  width: 100%;
  height: 280px;
  background: #1A0B14;
  position: relative;
  overflow: hidden;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 1rem;
  z-index: 10;
`;

const ContentSection = styled.div`
  padding: 2rem 1.5rem;
  margin-top: -20px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1.5rem;
`;

const TemperatureBar = styled.div`
  width: 100%;
  height: 100px;
  background: #f0f0f0;
  border-radius: 15px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin: 1rem 0 0.2rem;
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const TemperatureText = styled.div`
  color: #333;
  font-size: 0.95rem;
  flex: 1;
`;

const TemperatureValue = styled.div`
  color: #FF1493;
  font-weight: bold;
  font-size: 1.1rem;
  margin-left: 1rem;
  
  span {
    font-size: 0.8rem;
    margin-left: 1px;
  }
`;

const TemperatureMeter = styled.div<{ temperature: number }>`
  width: 100%;
  height: 10px;
  background: #e0e0e0;
  border-radius: 5px;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.temperature}%;
    background: linear-gradient(to right, #FF69B4, #4169E1);
    border-radius: 5px;
    transition: width 0.3s ease;
  }
`;

const PercentageText = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 2rem;

  span {
    color: #FF69B4;
    font-weight: 600;
  }
`;

const Description = styled.p`
  text-align: center;
  color: #666;
  line-height: 1.6;
  margin: 2rem 0;
  font-size: 0.95rem;
  white-space: pre-line;
`;

const InviteButton = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 30px;
  background: linear-gradient(to right, #FF69B4, #FF1493);
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StyledBackButton = styled(BackButton)`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  
  svg {
    fill: rgba(255, 255, 255, 0.8);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

// 온도에 따른 결과 데이터
const resultData = {
  100: {
    title: "♥ 완전 연결",
    description: "두 분의 관계는 뜨겁게 연결되어 있어요. 서로에 대한 이해와 애정이 충만합니다. 지금처럼만 유지할 수 있도록, 리커넥트를 통해 서로의 감정을 주기적으로 확인해보세요.",
    image: "/images/img1.jpg"
  },
  90: {
    title: "□ 거의 이상적",
    description: "거의 모든 영역에서 건강한 관계를 유지 중이에요. 감사 표현이나 소소한 챌린지를 리커넥트를 통해 함께 해보세요. 관계는 더 깊어질 수 있어요.",
    image: "/images/img2.jpg"
  },
  80: {
    title: "□ 안정적인 유대",
    description: "서로를 향한 신뢰가 잘 유지되고 있어요. 리커넥트를 통해 감정 카드나 감정 캘린더를 함께 작성해보세요. 더 많은 대화가 열릴 거예요.",
    image: "/images/img3.jpg"
  },
  70: {
    title: "□ 일상적인 연결",
    description: "큰 문제는 없지만 감정 표현이 줄었을 수 있어요. 리커넥트를 통해 '감사 노트'를 작성하거나 챌린지를 시작해보세요. 작지만 중요한 변화가 생길 거예요.",
    image: "/images/img4.jpg"
  },
  60: {
    title: "□ 무심한 평온",
    description: "관계는 유지되지만 정서적 활력이 줄어들고 있어요. 리커넥트를 통해 대화 주제를 던지거나 감정 퀴즈로 공감대를 되살려보세요.",
    image: "/images/img5.jpg"
  },
  50: {
    title: "□ 어색한 거리감",
    description: "감정 표현이나 소통이 어색해진 상태예요. 리커넥트를 통해 부담 없이 감정 카드를 주고받으며 자연스럽게 대화를 회복해보세요.",
    image: "/images/img6.jpg"
  },
  40: {
    title: "□ 감정적 단절",
    description: "정서적 거리감이 커지고 있어요. 리커넥트로 작은 교류를 시작하거나 전문가 연결 기능을 통해 회복의 첫걸음을 떼어보세요.",
    image: "/images/img1.jpg" // Placeholder
  },
  0: {
    title: "※ 정서적 냉각기",
    description: "지금은 서로의 마음이 닫혀 있는 상태예요. 혼자 고민하지 말고, 리커넥트를 통해 상담사 매칭이나 감정일기로 정서 회복을 시작해보세요.",
    image: "/images/img2.jpg" // Placeholder
  }
};

const getResultByTemperature = (temp: number) => {
  if (temp === 100) return resultData[100];
  if (temp >= 90) return resultData[90];
  if (temp >= 80) return resultData[80];
  if (temp >= 70) return resultData[70];
  if (temp >= 60) return resultData[60];
  if (temp >= 50) return resultData[50];
  if (temp >= 40) return resultData[40];
  return resultData[0];
};

// 가상 평균 데이터 (80명 기준, 평균 점수 하향 조정)
const virtualScores = [
  95, 91, 88, 85, 82, 80, 78, 77, 75, 75, 72, 71, 70, 70, 69, 68, 67, 66, 65, 65, 
  64, 63, 62, 61, 60, 60, 59, 58, 57, 56, 55, 55, 54, 53, 52, 51, 50, 50, 49, 48, 
  47, 46, 45, 44, 43, 42, 41, 40, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 
  28, 27, 26, 25, 24, 23, 22, 21, 20, 18, 17, 15, 14, 12, 11, 10, 8, 6, 5
];

// 사용자의 점수가 상위 몇 퍼센트인지 계산하는 함수
const calculatePercentageRank = (userScore: number) => {
  const totalPopulation = virtualScores.length + 1;
  const rank = virtualScores.filter(score => score > userScore).length + 1;
  const percentile = (rank / totalPopulation) * 100;
  return Math.round(percentile);
};

const DiagnosisResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 예외 처리: location.state 또는 location.state.answers가 없을 경우
  if (!location.state?.answers) {
    // 경고 메시지를 보여주고 진단 페이지로 리디렉션
    alert("진단 결과가 없습니다. 진단 페이지로 돌아갑니다.");
    navigate('/diagnosis', { replace: true });
    return null; // 리디렉션 후 렌더링 중단
  }

  const answers: string[] = location.state.answers;

  const totalScore = answers.reduce((score, answer, index) => {
    const question = diagnosisQuestions[index];
    if (question && answer in question.scores) {
      return score + question.scores[answer as 'yes' | 'neutral' | 'no'];
    }
    return score;
  }, 0);

  const temperature = Math.round((totalScore / MAX_SCORE) * 100);
  const result = getResultByTemperature(temperature);
  const percentageRank = calculatePercentageRank(temperature);

  const handleLike = () => {
    // TODO: Implement like functionality
    console.log('Like clicked');
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download clicked');
  };

  return (
    <Container>
      <StyledBackButton />
      <ActionButtons>
        <ActionButton type="like" onClick={handleLike} />
        <ActionButton type="download" onClick={handleDownload} />
      </ActionButtons>
      <ImageSection>
        <img src={result.image} alt="Temperature illustration" />
      </ImageSection>
      
      <ContentSection>
        <Title>{result.title}</Title>
        <TemperatureBar>
          <TopSection>
            <TemperatureText>우리 지금 이대로 괜찮은걸까...</TemperatureText>
            <TemperatureValue>
              {temperature}<span>℃</span>
            </TemperatureValue>
          </TopSection>
          <TemperatureMeter temperature={temperature} />
        </TemperatureBar>
        
        <PercentageText>
          우리 부부는 평균 부부의 <span>상위 {percentageRank}%</span>에 속해있습니다.
        </PercentageText>
        
        <Description>{result.description}</Description>

        <InviteButton onClick={() => navigate('/welcome')}>
          확인
        </InviteButton>
      </ContentSection>
    </Container>
  );
};

export default DiagnosisResult;