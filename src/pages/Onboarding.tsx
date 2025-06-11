import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useSwipeable } from "react-swipeable";

const Container = styled.div`
  display: flex;
  flex-direction: column;
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

const Card = styled.div<{ $index: number }>`
  width: 100%;
  height: 100%;
  background: ${({ $index }) => {
    const colors = [
      'linear-gradient(135deg, #FF9A9E, #FAD0C4)',
      'linear-gradient(135deg, #A8EDEA, #FED6E3)',
      'linear-gradient(135deg, #D4FC79, #96E6A1)',
      'linear-gradient(135deg, #E2B0FF, #9F44D3)',
      'linear-gradient(135deg, #FFE985, #FA742B)'
    ];
    return colors[$index];
  }};
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #333;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  user-select: none;
`;

const ButtonContainer = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StartButton = styled.button`
  background: linear-gradient(to right, #FF69B4, #8A2BE2);
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
    width: 400px;
  }
`;

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalCards = 5;

  useEffect(() => {
    if (localStorage.getItem('hasVisited') === 'true') {
      navigate('/welcome', { replace: true });
    }
  }, [navigate]);

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
    trackMouse: false,
    trackTouch: true,
    preventScrollOnSwipe: true,
    delta: 10,
    swipeDuration: 500,
  });

  const handleCardClick = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (direction === 'right' && currentIndex < totalCards - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleStart = () => {
    localStorage.setItem('hasVisited', 'true');
    navigate("/diagnosis");
  };

  return (
    <Container>
      <Header>
        <Title>지금 당신의 관계 괜찮으신가요?</Title>
        <Subtitle>우리 부부, 어느 순간부터 대화를 놓쳤을지도 몰라요</Subtitle>
      </Header>

      <CardsContainer {...handlers}>
        {[...Array(totalCards)].map((_, index) => (
          <CardWrapper
            key={index}
            $index={index}
            $currentIndex={currentIndex}
            $total={totalCards}
            onClick={() => handleCardClick(index > currentIndex ? 'right' : 'left')}
          >
            <Card $index={index}>
              이미지{index + 1}
            </Card>
          </CardWrapper>
        ))}
      </CardsContainer>

      <ButtonContainer>
        <StartButton onClick={handleStart}>
          지금 시작하기
        </StartButton>
      </ButtonContainer>
    </Container>
  );
};

export default Onboarding;
