import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "../api/axios";
import BackButton from '../components/common/BackButton';
import { diagnosisQuestions, MAX_SCORE } from "../config/diagnosisQuestions";
import useAuthStore from '../store/authStore';
import ConfirmationModal from '../components/common/ConfirmationModal';

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


const ContentSection = styled.div`
  padding: 2rem 1.5rem;
  margin-top: -20px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Icon = styled.img`
  width: 28px;
  height: 28px;
  margin-right: 12px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0;
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
    background: linear-gradient(to right, #FF69B4, #785cd2);
    border-radius: 5px;
    transition: width 0.3s ease;
  }
`;

const PercentageText = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #333;
  margin-top: 0.8rem;
  margin-bottom: 1.2rem;

  span {
    color: #FF69B4;
    font-weight: 600;
  }
`;

const Description = styled.p`
background-color: #f0f0f0;
padding: 1rem;
border-radius: 10px;
  color: #666;
  line-height: 1.6;
  margin: 2rem 0;
  font-size: 0.95rem;
  white-space: pre-line;
`;

const StyledComparison = styled.span<{ color?: string; isBold?: boolean }>`
  color: ${({ color }) => color || 'inherit'};
  font-weight: ${({ isBold }) => (isBold ? 'bold' : 'normal')};
`;

const LoginText = styled.p`
 text-align: center;
  color: #777;
  line-height: 1.6;
  font-size: 1rem;
  
  
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 30px;
  background: #785cd2;
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
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
    title: "완전 연결",
    description: "두 분의 관계는 뜨겁게 연결되어 있어요. 서로에 대한 이해와 애정이 충만합니다. 지금처럼만 유지할 수 있도록, 리커넥트를 통해 서로의 감정을 주기적으로 확인해보세요.",
    image: "/images/img1.jpg"
  },
  90: {
    title: "거의 이상적",
    description: "거의 모든 영역에서 건강한 관계를 유지 중이에요. 감사 표현이나 소소한 챌린지를 리커넥트를 통해 함께 해보세요. 관계는 더 깊어질 수 있어요.",
    image: "/images/img2.jpg"
  },
  80: {
    title: "안정적인 유대",
    description: "서로를 향한 신뢰가 잘 유지되고 있어요. 리커넥트를 통해 감정 카드나 감정 캘린더를 함께 작성해보세요. 더 많은 대화가 열릴 거예요.",
    image: "/images/img3.jpg"
  },
  70: {
    title: "일상적인 연결",
    description: "큰 문제는 없지만 감정 표현이 줄었을 수 있어요. 리커넥트를 통해 '감사 노트'를 작성하거나 챌린지를 시작해보세요. 작지만 중요한 변화가 생길 거예요.",
    image: "/images/img4.jpg"
  },
  60: {
    title: "무심한 평온",
    description: "관계는 유지되지만 정서적 활력이 줄어들고 있어요. 리커넥트를 통해 대화 주제를 던지거나 감정 퀴즈로 공감대를 되살려보세요.",
    image: "/images/img5.jpg"
  },
  50: {
    title: "어색한 거리감",
    description: "감정 표현이나 소통이 어색해진 상태예요. 리커넥트를 통해 부담 없이 감정 카드를 주고받으며 자연스럽게 대화를 회복해보세요.",
    image: "/images/img6.jpg"
  },
  40: {
    title: "감정적 단절",
    description: "정서적 거리감이 커지고 있어요. 리커넥트로 작은 교류를 시작하거나 전문가 연결 기능을 통해 회복의 첫걸음을 떼어보세요.",
    image: "/images/img1.jpg" // Placeholder
  },
  0: {
    title: "정서적 냉각기",
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

const AVERAGE_TEMPERATURE = 61;

const DiagnosisResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuthStore();
  const isLoggedIn = !!token;
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  if (!location.state?.answers) {
    useEffect(() => {
      navigate('/diagnosis', { replace: true });
    }, [navigate]);
    return null; 
  }

  const { answers } = location.state;

  let totalScore = 0;
  answers.forEach((answer: 'yes' | 'no' | 'unknown', index: number) => {
    const question = diagnosisQuestions[index];
    if (answer === 'yes') {
      totalScore += question.scores.yes;
    } else if (answer === 'no') {
      totalScore += question.scores.no;
    } else {
      totalScore += question.scores.neutral;
    }
  });

  const temperature = Math.round((totalScore / MAX_SCORE) * 100);
  const result = getResultByTemperature(temperature);
  
  useEffect(() => {
    const saveResult = async () => {
      if (isLoggedIn) {
        try {
          await axios.post('/diagnosis', { score: temperature, resultType: result.title });
        } catch (error) {
          console.error("진단 결과 저장 실패:", error);
        }
      } else {
        localStorage.setItem('diagnosisResult', JSON.stringify({ score: temperature, createdAt: new Date().toISOString() }));
      }
    };
    saveResult();
  }, [isLoggedIn, temperature, result.title]);

  const temperatureDifference = temperature - AVERAGE_TEMPERATURE;
  const comparisonDisplay =
    temperatureDifference > 0 ? (
      <>
        우리 커플의 관계는 평균보다 <StyledComparison color="#FF69B4">{temperatureDifference}도 높은</StyledComparison> 온도입니다
      </>
    ) : temperatureDifference < 0 ? (
      <>
        우리 커플의 관계는 평균보다 <StyledComparison color="#4169E1">{Math.abs(temperatureDifference)}도 낮은</StyledComparison> 온도입니다
      </>
    ) : (
      <>
        우리 커플의 관계는 <StyledComparison isBold>평균과 같은 온도</StyledComparison>입니다
      </>
    );

  const handleBack = () => {
    setIsModalOpen(true);
  };

  const handleConfirmBack = () => {
    navigate(-1);
  };

  const handleNextStep = () => {
    // 비회원일 때 진단 결과를 state에 담아 로그인 페이지로 전달
    navigate('/login', { state: { answers } });
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/diagnosis`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '리커넥트: 우리 관계 진단하기',
          text: '우리 관계의 온도를 확인해볼까? 지금 바로 관계 진단을 시작해보세요!',
          url: shareUrl,
        });
      } catch (error) {
        console.error('공유 기능 에러:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('진단 링크가 클립보드에 복사되었어요. 파트너에게 공유해주세요!');
      } catch (err) {
        console.error('클립보드 복사 실패:', err);
        alert('링크 복사에 실패했습니다.');
      }
    }
  };

  return (
    <Container>
      <StyledBackButton onClick={handleBack} />
      <ImageSection>
        <img src={result.image} alt={result.title} />
      </ImageSection>
      
      <ContentSection>
        <TitleContainer>
          <Icon src="/images/favicon.png" alt="icon" />
          <Title>{result.title}</Title>
        </TitleContainer>
        <TemperatureBar>
          <TopSection>
            <TemperatureText>우리의 관계 온도</TemperatureText>
            <TemperatureValue>{temperature}<span>°C</span></TemperatureValue>
          </TopSection>
          <TemperatureMeter temperature={temperature} />
        </TemperatureBar>
        
        <PercentageText>
          {comparisonDisplay}
        </PercentageText>
        
        <Description>{result.description}</Description>

        {!isLoggedIn ? (
          <>
            <LoginText>지금 전문진단 서비스 무료 이벤트 중<br/>(10만원 상당)</LoginText>
            <ActionButton onClick={handleNextStep}>
              결혼생활 진단 시작하기
            </ActionButton>
            <InviteButton onClick={handleShare}>
              파트너에게 테스트 요청하기
            </InviteButton>
          </>
        ) : (
          <InviteButton onClick={handleShare}>
            파트너에게 테스트 요청하기
          </InviteButton>
        )}
      </ContentSection>
      <ConfirmationModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmBack}
        message="진단결과가 삭제되며 다시 진단이 시작됩니다. 계속하시겠습니까?"
        confirmButtonText="계속"
      />
    </Container>
  );
};

export default DiagnosisResult;