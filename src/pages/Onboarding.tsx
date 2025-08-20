import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AuthContainer as BaseAuthContainer } from '../styles/CommonStyles';
import { useSwipeable } from "react-swipeable";
import Onboarding1 from "../assets/onboarding1.png";
import Onboarding2 from "../assets/onboarding2.png";
import Onboarding3 from "../assets/onboarding3.png";
import Onboarding4 from "../assets/onboarding4.png";
import Onboarding5 from "../assets/onboarding5.png";
import Onboarding6 from "../assets/onboarding6.png";
import Onboarding7 from "../assets/onboarding7.png";

const Container = styled(BaseAuthContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background: #0A1B3D;
  padding: 3rem 1rem 2rem;
  color: white;
  position: relative;
  overflow: hidden;
  @media (min-width: 768px) {
    padding: 4rem 2rem 2rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    margin-bottom: 4rem;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #ff69b4;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const CardsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  margin: 2rem 0;
  touch-action: pan-y pinch-zoom;
  
  @media (min-width: 768px) {
    height: 500px;
  }
`;

const CardWrapper = styled.div<{ $index: number; $currentIndex: number; $total: number }>`
  position: absolute;
  width: 280px;
  height: 400px;
  left: 50%;
  transition: all 0.5s ease;
  z-index: ${({ $index, $currentIndex }) => 
    $index === $currentIndex ? 3 : 
    Math.abs($index - $currentIndex) === 1 ? 2 : 1
  };

  @media (max-width: 767px) {
    transform: ${({ $index, $currentIndex }) => {
      const diff = $index - $currentIndex;
      if (diff === 0) return 'translateX(-50%) scale(1)';
      if (Math.abs(diff) === 1) {
        const direction = diff > 0 ? 1 : -1;
        return `translateX(calc(-50% + ${direction * 260}px)) scale(0.9) translateY(20px)`;
      }
      return 'translateX(-50%) scale(0.8) translateY(40px)';
    }};
    opacity: ${({ $index, $currentIndex }) => 
      Math.abs($index - $currentIndex) > 1 ? 0 : 1};
  }

  @media (min-width: 768px) {
    transform: ${({ $index, $currentIndex }) => {
      const diff = $index - $currentIndex;
      if (diff === 0) return 'translateX(-50%) scale(1)';
      if (Math.abs(diff) === 1) {
        const direction = diff > 0 ? 1 : -1;
        return `translateX(calc(-50% + ${direction * 300}px)) scale(0.9) translateY(30px)`;
      }
      return 'translateX(-50%) scale(0.8) translateY(60px)';
    }};
  }
`;

const Card = styled.div<{ $imageUrl: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${({ $imageUrl }) => $imageUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  user-select: none;
`;

const StartButton = styled.button`
  background: linear-gradient(to right, #ff69b4, #8a2be2);
  color: white;
  padding: 1rem 2rem;
  margin-bottom: 8rem;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  width: 100%;
  max-width: 400px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  @media (min-width: 768px) {
  margin-top:2rem;
    width: 400px;
  }
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 2rem;
`;

const Dot = styled.div<{ $isActive: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ $isActive }) => ($isActive ? '#FF69B4' : '#808080')};
  margin: 0 5px;
`;

const onboardingSlides = [
  { 
    image: Onboarding1,
    title: "내 감정을 기록하고 아껴요",
    subtitle: "컬러와 트리거 선택, 짧은 텍스트로 간단하게 감정 일기를 작성하면 AI가 감정 흐름을 분석 해 줘요"
  },
  { 
    image: Onboarding2,
    title: "대화가 쉽고 따뜻해져요",
    subtitle: "어색한 말 대신 감정 카드로마음을 주고받으며 정서적 거리를 가깝게 해요"
  },
  { 
    image: Onboarding3,
    title: "함께 하는 시간을 만들어요",
    subtitle: "같이 하는 작은 실천 주간 커플 챌린지로 관계에 온기가 더 해져요"
  },
  { 
    image: Onboarding4,
    title: "노력을 데이터로 보여줘요",
    subtitle: "매주 발행되는 관계 리포트에서 함께한 노력들과 감정의 흐름 우리의 온도를 쉽게 확인할 수 있어요"
  },
  { 
    image: Onboarding5,
    title: "책임있는 약속을 만들어요",
    subtitle: "책임을 바탕으로 ‘합의된 약속’인증된 합의서는 안전하게 보관되어 언제든지 확인할 수 있어요"
  },
  { 
    image: Onboarding6,
    title: "전문가를 연결해요",
    subtitle: "혼자서는 너무 힘들때 심리,법률 등 나에게 딱 맞고 믿음직 하고 든든한 전문가를 연결해요"
  },
  { 
    image: Onboarding7,
    title: "함께 만들어가는 우리만의 이야기",
    subtitle: "리커넥트와 함께 시작하세요"
  },
];

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalCards = onboardingSlides.length;

  // useEffect(() => {
  //   if (localStorage.getItem('hasVisited') === 'true') {
  //     navigate('/welcome', { replace: true });
  //   }
  // }, [navigate]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < totalCards - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    },
    trackMouse: true,
  });

  const handleStart = () => {
    navigate('/login');
  };

  const handleCardClick = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (direction === 'right' && currentIndex < totalCards - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <Container {...handlers}>
      <Header>
        <Title>{onboardingSlides[currentIndex].title}</Title>
        <Subtitle>{onboardingSlides[currentIndex].subtitle}</Subtitle>
      </Header>

      <CardsContainer>
        {onboardingSlides.map((slide, index) => (
          <CardWrapper
            key={index}
            $index={index}
            $currentIndex={currentIndex}
            $total={totalCards}
            onClick={() => handleCardClick(index > currentIndex ? 'right' : 'left')}
          >
            <Card $imageUrl={slide.image} />
          </CardWrapper>
        ))}
      </CardsContainer>

      <DotsContainer>
        {Array.from({ length: totalCards }).map((_, index) => (
          <Dot key={index} $isActive={index === currentIndex} />
        ))}
      </DotsContainer>
      
      <StartButton onClick={handleStart}>시작하기</StartButton>
    </Container>
  );
};

export default Onboarding;
