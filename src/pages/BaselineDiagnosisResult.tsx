import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axiosInstance from "../api/axios";
import BackButton from '../components/common/BackButton';
import { MAX_SCORE } from "../config/baselineDiagnosisQuestions";
import useAuthStore from '../store/authStore';
import ConfirmationModal from '../components/common/ConfirmationModal';
import newLogo from '../assets/favicon.png';
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import img4 from '../assets/img4.jpg';
import img5 from '../assets/img5.jpg';
import img6 from '../assets/img6.jpg';
import GoogleIcon from '../assets/btn_google.svg?url';
import AppleIcon from '../assets/btn_apple.svg?url';

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
  font-size: 0.9rem;
  color: #333;
  margin-top: 0.8rem;
  margin-bottom: 1.2rem;

  span {
    color: #FF69B4;
    font-weight: 600;
  }
`;

const Description = styled.p`
  background: linear-gradient(135deg, #FFF5FB 0%, #F2EEFF 100%);
  padding: 1.25rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(120, 92, 210, 0.25);
  color: #443b4f;
  line-height: 1.7;
  margin: 1.5rem 0 1.75rem;
  font-size: 1rem;
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

const AndroidButton = styled(ActionButton)`
  background: #ffffff;
  color: #202124;
  border: 1px solid #dadce0;
`;

const IosButton = styled(ActionButton)`
  background: #000000;
  color: #ffffff;
  img { filter: invert(1) brightness(1.8) contrast(1.1); }
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 0.75rem;

  ${ActionButton} {
    width: auto;
    flex: 1;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
`;

const PromoContainer = styled.div`
  background: linear-gradient(135deg, #FFE5E5 0%, #E5E5FF 100%);
  padding: 20px;
  border-radius: 12px;
  margin: 1rem 0 1rem;
`;

const PromoTitle = styled.h3`
  color: #785cd2;
  margin-bottom: 15px;
  font-size: 1.1rem;
  font-weight: bold;
`;

const PromoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.95rem;
  color: #555;
`;

const PromoListItem = styled.li`
  margin-bottom: 8px;
`;

const PromoCTA = styled.p`
  font-size: 1rem;
  color: #FF69B4;
  font-weight: bold;
  text-align: center;
  margin: 12px 0 0;
`;

const IconImage = styled.img`
  width: 18px;
  height: 18px;
  vertical-align: middle;
  margin-right: 6px;
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
    description: "❤️‍🔥 두 분의 관계는 뜨겁게 연결되어 있어요. 서로에 대한 이해와 애정이 충만합니다.\n지금처럼 따뜻한 표현과 배려를 꾸준히 이어가면 좋아요. 서로의 장점을 자주 말해주고, 한 달에 한 번 둘만의 시간을 계획해 보세요.\n리커넥트에서 감정 기록과 대화 가이드, 작은 실천 루틴을 안내해 드려요.",
    image: img1
  },
  90: {
    title: "거의 이상적",
    description: "💐 거의 모든 영역에서 건강한 관계를 유지 중이에요. 관계는 더 깊어질 수 있어요.\n가끔 바쁠 때는 소통이 느슨해질 수 있으니, 2~3일에 한 번 서로의 하루를 5문장으로 나누고 주 1회 감사 표현을 시도해 보세요.\n리커넥트에서 감정 기록과 대화 가이드, 작은 실천 루틴을 안내해 드려요.",
    image: img2
  },
  80: {
    title: "안정적인 유대",
    description: "🤝 서로를 향한 신뢰가 잘 유지되고 있어요.\n서로의 기대와 필요를 구체적으로 말하는 연습을 해보세요. 일주일에 한 번 대화 주제를 정해 15분만 집중해서 이야기하면 연결감이 커집니다.\n리커넥트를 통해 감정 카드나 감정 캘린더를 함께 작성해보세요. 더 많은 대화가 열릴 거예요.",
    image: img3
  },
  70: {
    title: "일상적인 연결",
    description: "😐 큰 문제는 없지만 감정 표현이 줄었을 수 있어요.\n상대가 무엇을 원했는지 짐작하기보다 질문으로 확인해 보세요. 오늘 좋았던 한 가지와 고마웠던 한 가지를 서로에게 말해보면 분위기가 부드럽게 풀립니다.\n리커넥트를 통해 '감사 노트'를 작성하거나 챌린지를 시작해보세요. 작지만 중요한 변화가 생길 거예요.",
    image: img4
  },
  60: {
    title: "무심한 평온",
    description: "🌊 관계는 유지되지만 정서적 활력이 줄어들고 있어요.\n비난이나 충고를 줄이고 ‘관찰-느낌-요청’ 구조로 말해보세요. 매일 10분 산책처럼 작은 공동 루틴을 만들면 정서적 에너지가 회복됩니다.\n리커넥트를 통해 대화 주제를 던지거나 감정 퀴즈로 공감대를 되살려보세요.",
    image: img5
  },
  50: {
    title: "어색한 거리감",
    description: "🤔 감정 표현이나 소통이 어색해진 상태예요.\n안전한 주제부터 대화를 재시작하고, ‘중단 없이 듣기 3분’ 규칙을 정해보세요. 갈등이 생기면 20분 휴지 시간을 두고 다시 이야기하면 도움이 됩니다.\n리커넥트를 통해 부담 없이 감정 카드를 주고받으며 자연스럽게 대화를 회복해보세요.",
    image: img6
  },
  40: {
    title: "감정적 단절",
    description: "💔 정서적 거리감이 커지고 있어요.\n대화 재개는 짧고 자주가 좋습니다. 민감한 주제는 잠시 미루고 안부나 일상부터 가볍게 시작해 보세요. 혼자 감정 기록을 해보며 감정 어휘를 늘리는 것도 도움이 됩니다. 필요하다면 신뢰할 수 있는 제3자의 도움을 고려해 보세요.\n리커넥트로 작은 교류를 시작하거나 전문가 연결 기능을 통해 회복의 첫걸음을 떼어보세요.",
    image: img1 
  },
  0: {
    title: "정서적 냉각기",
    description: "🥶 지금은 서로의 마음이 닫혀 있는 상태예요.\n잠시 관계를 점검하는 시간이 필요할 수 있습니다. 서로의 ‘안전 신호’를 정하고, 비난·조롱을 중단하는 합의부터 시작해 보세요. 혼자 견디기 어렵다면 전문적인 도움을 받는 것도 괜찮습니다.\n리커넥트를 통해 상담사 매칭이나 감정일기로 정서 회복을 시작해보세요.",
    image: img2 
  }
};

const getResultByTemperature = (temp: number) => {
  const roundedTemp = Math.floor(temp / 10) * 10;
  return resultData[roundedTemp as keyof typeof resultData] || resultData[0];
};

const BaselineDiagnosisResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { answers, score: rawScore } = location.state || { answers: [], score: 0 };
  const temperature = Math.round((rawScore / MAX_SCORE) * 100);
  const result = getResultByTemperature(temperature);

  useEffect(() => {
    if (!isAuthenticated && rawScore > 0) {
      const diagnosisResult = {
        score: temperature,
        answers: answers,
      };
      localStorage.setItem('baselineDiagnosisAnswers', JSON.stringify(diagnosisResult));
    } else if (isAuthenticated && rawScore > 0) {
      saveResult(temperature, answers);
    }
  }, [isAuthenticated, rawScore, answers, temperature]);

  const saveResult = async (finalScore: number, answers: (string | null)[]) => {
    setLoading(true);
    try {
      const endpoint = isAuthenticated ? '/diagnosis' : '/diagnosis/unauth';
      
      const payload: any = {
        score: finalScore,
        resultType: '기초 관계온도',
        diagnosisType: 'BASELINE_TEMPERATURE',
      };

      if (isAuthenticated) {
        payload.answers = answers;
      }

      const response = await axiosInstance.post(endpoint, payload);

      if (!isAuthenticated && response.data && response.data.id) {
        localStorage.setItem('unauthDiagnosisId', response.data.id);
      }
    } catch (error) {
      console.error("Error saving diagnosis result:", error);
    } finally {
      setLoading(false);
    }
  };

  const temperatureDifference = temperature - 61;

  const handleBack = () => {
    setShowModal(true);
  };

  const handleConfirmBack = () => {
    localStorage.removeItem('baselineDiagnosisAnswers');
    navigate('/diagnosis', { replace: true });
  };

  const ANDROID_STORE_URL = 'https://play.google.com/store/apps/details?id=com.reconnect.kwcc';
  const IOS_APP_STORE_URL = 'https://apps.apple.com/app/id6749503525';

  const handleOpenAndroid = () => {
    window.open(ANDROID_STORE_URL, '_blank', 'noopener,noreferrer');
  };

  const handleOpenIos = () => {
    window.open(IOS_APP_STORE_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <Container>
      <ImageSection>
        <img src={result.image} alt={result.title} />
        <StyledBackButton onClick={handleBack} />
      </ImageSection>
      <ContentSection>
        <TitleContainer>
          <Icon src={newLogo} alt="icon" />
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
          우리 커플의 관계는 평균보다 <StyledComparison {...(temperatureDifference > 0 ? { color: '#FF1493', isBold: true } : { color: '#4169E1', isBold: false })}>{Math.abs(temperatureDifference)}°C</StyledComparison> {temperatureDifference > 0 ? '높은 온도입니다' : '낮은 온도입니다'}
        </PercentageText>
        
        <Description>{result.description}</Description>

        {!user ? (
          <>
            <LoginText>
            {/* ⚠️텍스트 절대 바꾸지 말기!!! */}
              기초 진단만으로는 관계를 이해하기 어려워요.<br/>
              로그인만으로 결혼생활 정식 진단을<br/>무료로 받을 수 있어요.<br/>
              관계를 더 따뜻하게 할 한걸음 1분이면 충분해요.
            </LoginText>
            <PromoContainer>
              <PromoTitle>🎉 이벤트 기간 가입 혜택</PromoTitle>
              <PromoList>
                <PromoListItem>✅ 결혼생활 정식 진단</PromoListItem>
                <PromoListItem>✅ 책임이 담긴 인증 합의서 무제한 발행</PromoListItem>
                <PromoListItem>✅ 감정 일기 분석 + AI감정 리포트 제공</PromoListItem>
              </PromoList>
              <PromoCTA>지금 바로 나와 우리의 관계를 더 깊고 건강하게 만들어 보세요! 💖</PromoCTA>
            </PromoContainer>
            <ButtonsRow>
              <AndroidButton onClick={handleOpenAndroid} disabled={loading}>
                <IconImage src={GoogleIcon} alt="Google" />
                <span>안드로이드</span>
                <br />
                <span>무료 정식 진단</span>
              </AndroidButton>
              <IosButton onClick={handleOpenIos} disabled={loading}>
                <IconImage src={AppleIcon} alt="Apple" />
                <span>애플</span>
                <br />
                <span>무료 정식 진단</span>
              </IosButton>
            </ButtonsRow>
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