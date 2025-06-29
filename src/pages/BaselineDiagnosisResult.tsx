import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axiosInstance from "../api/axios";
import BackButton from '../components/common/BackButton';
import { diagnosisQuestions, MAX_SCORE } from "../config/baselineDiagnosisQuestions";
import useAuthStore from '../store/authStore';
import ConfirmationModal from '../components/common/ConfirmationModal';
import newLogo from '../assets/favicon.png';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: white;
  position: relative;
`;

const ImageSection = styled.div`
  width: 100%;
  height: 200px;
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

  &:disabled {
    background: #c5b8e3;
    cursor: not-allowed;
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

  &:disabled {
    background: #ffc2d8;
    cursor: not-allowed;
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
  const roundedTemp = Math.floor(temp / 10) * 10;
  return resultData[roundedTemp as keyof typeof resultData] || resultData[0];
};

const calculateScore = (answers: (string | null)[]) => {
  let calculatedScore = 0;
  answers.forEach((answer: string | null, index: number) => {
    const question = diagnosisQuestions[index];
    if (question && answer) {
      const key = answer === 'unknown' ? 'neutral' : (answer as 'yes' | 'no');
      if (question.scores.hasOwnProperty(key)) {
        calculatedScore += question.scores[key];
      }
    }
  });
  return Math.round((calculatedScore / MAX_SCORE) * 100);
};

const BaselineDiagnosisResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [score, setScore] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (location.state && location.state.answers) {
      const { answers } = location.state;
      const finalScore = calculateScore(answers);
      setScore(finalScore);
      // 비회원일 때만 결과를 저장합니다.
      if (!user) {
        saveResult(finalScore, answers);
      }
    } else {
      navigate("/baseline-diagnosis");
    }
  }, [location, navigate, user]);

  const saveResult = async (finalScore: number, answers: (string | null)[]) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/diagnosis/unauth', {
        score: finalScore,
        resultType: '기초 관계온도',
        diagnosisType: 'BASELINE_TEMPERATURE',
        answers, // Optional: for detailed analysis later
      });
      // 비회원 진단 ID를 로컬 스토리지에 저장
      if (response.data && response.data.id) {
        localStorage.setItem('unauthDiagnosisId', response.data.id);
      }
    } catch (error) {
      console.error("Error saving diagnosis result:", error);
    } finally {
      setLoading(false);
    }
  };

  const result = getResultByTemperature(score);
  const temperatureDifference = score - 61; // 평균 대신 초기값 61과 비교

  const handleBack = () => {
    setShowModal(true);
  };

  const handleConfirmBack = () => {
    localStorage.removeItem('unauthDiagnosisId'); // 이전 키도 제거
    localStorage.removeItem('baselineDiagnosisResult');
    sessionStorage.removeItem('baselineDiagnosisAnswers');
    navigate('/diagnosis', { replace: true });
  };

  const handleNextStep = () => {
    navigate('/register');
  };

  const handleShare = async () => {
    const shareData = {
      title: '리커넥트 관계온도 진단 결과',
      text: `저의 관계온도는 ${score}점이에요! 당신의 점수도 확인해보세요!`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // navigator.share를 지원하지 않는 경우 (예: 데스크톱)
        alert('공유 기능은 모바일에서만 지원됩니다.');
      }
    } catch (error) {
      console.error('공유 실패:', error);
    }
  };

  if (!location.state?.answers) {
    const storedAnswers = sessionStorage.getItem('baselineDiagnosisAnswers');
    if (!storedAnswers) {
      return null; // 리디렉션 중이므로 렌더링하지 않음
    }
  }
  
  return (
    <Container>
      <ImageSection>
        <img src={result.image} alt={result.title} />
        <StyledBackButton onClick={handleBack} />
      </ImageSection>
      <ContentSection>
        <TitleContainer>
          <Icon src={newLogo} alt="icon" />
          <Title>기초 관계온도 진단 결과</Title>
        </TitleContainer>
        <TemperatureBar>
          <TopSection>
            <TemperatureText>우리의 관계 온도</TemperatureText>
            <TemperatureValue>{score}<span>°C</span></TemperatureValue>
          </TopSection>
          <TemperatureMeter temperature={score} />
        </TemperatureBar>
        
        <PercentageText>
          당신의 관계 온도는 평균보다 <StyledComparison {...(temperatureDifference > 0 ? { color: '#FF1493', isBold: true } : { color: '#4169E1', isBold: false })}>{Math.abs(temperatureDifference)}°C</StyledComparison> {temperatureDifference > 0 ? '높아요🥰' : '낮아요😢'}.
        </PercentageText>
        
        <Description>{result.description}</Description>

        {!user ? (
          <>
            <LoginText>
              회원가입하고 파트너와 연결하면<br/>
              더 정확한 진단과 솔루션을 받을 수 있어요!
            </LoginText>
            <ActionButton onClick={handleNextStep} disabled={loading}>회원가입하고 이어하기</ActionButton>
            <InviteButton onClick={handleShare} disabled={loading}>결과 공유하기</InviteButton>
          </>
        ) : (
          <ActionButton onClick={() => navigate('/dashboard')}>대시보드로 이동</ActionButton>
        )}
      </ContentSection>
      <ConfirmationModal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        onConfirm={handleConfirmBack}
        message="진단 결과가 저장되지 않고, 다시 진단이 시작됩니다. 정말로 돌아가시겠습니까?"
        confirmButtonText="돌아가기"
        cancelButtonText="취소"
      />
    </Container>
  );
};

export default BaselineDiagnosisResult; 