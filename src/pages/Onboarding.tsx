import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useSwipeable } from "react-swipeable";
import Onboarding1 from "../assets/Onboarding_1.png";
import Onboarding2 from "../assets/Onboarding_2.png";
import Onboarding3 from "../assets/Onboarding_3.png";
import Onboarding4 from "../assets/Onboarding_4.png";
import Onboarding5 from "../assets/Onboarding_5.png";
import Onboarding6 from "../assets/Onboarding_6.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
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
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    margin-bottom: 4rem;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
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
  padding: 1rem 3rem;
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
  { image: Onboarding1 },
  { image: Onboarding2 },
  { image: Onboarding3 },
  { image: Onboarding4 },
  { image: Onboarding5 },
  { image: Onboarding6 },
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
    navigate('/diagnosis');
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
        <Title>우리의 시작 온도는 몇 도일까요?</Title>
        <Subtitle>관계를 더 깊이 이해하기 위한 첫 걸음</Subtitle>
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
      
      <StartButton onClick={handleStart}>기초 관계온도 진단하기</StartButton>
    </Container>
  );
};

export default Onboarding;
