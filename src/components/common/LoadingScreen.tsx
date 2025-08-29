import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(var(--vh, 1vh) * 100);
  min-height: 100dvh;
  background: linear-gradient(135deg,rgb(155, 200, 254) 0%,rgb(46, 107, 206) 50%, #1e40af 100%);
  padding: 2rem 2rem 10rem;
  color: white;
  text-align: center;
`;

const LoadingIcon = styled.div`
  width: 150px;
  height: 150px;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const LoadingText = styled.h2`
  font-size: 1rem;
  color:rgb(189, 225, 255);
  font-weight: 600;
  margin-bottom: 3rem;
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;
`;

const MessageText = styled.p`
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.6;
  margin: 2.5rem 0;
  max-width: 500px;
  animation: ${fadeInUp} 0.8s ease-out 0.5s both;
`;

const MessageTextLeft = styled(MessageText)`
  text-align: left;
  align-self: flex-start;
  animation: ${fadeInUp} 0.8s ease-out 1.5s both;
`;

const MessageTextRight = styled(MessageText)`
  text-align: right;
  align-self: flex-end;
  animation: ${fadeInUp} 0.8s ease-out 2.5s both;
`;

const MessageTextLeft2 = styled(MessageText)`
  text-align: left;
  align-self: flex-start;
  animation: ${fadeInUp} 0.8s ease-out 3.5s both;
`;

const HighlightText = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
`;

interface LoadingScreenProps {
  onComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    // 15초초후에 로딩 완료
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 15000);

    return () => {
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <Container>
      <LoadingIcon>
        <DotLottieReact
          src="https://lottie.host/a57a2f81-6c33-4aa2-a18e-9cf405899b52/ypZkZkTZjc.lottie"
          loop
          autoplay
        />
      </LoadingIcon>
      <LoadingText>지금 당신의 감정을 정밀하게 분석하고 있어요<br/> 최대 30초가 소요될수 있습니다.</LoadingText>
      
      <MessageTextLeft>
        감정의 흐름뿐 아니라, <br /><HighlightText>소중한 관계까지 이해할 때</HighlightText><br/> 삶이 더 깊고 행복해집니다.
      </MessageTextLeft>
      
      <MessageTextRight>
        리커넥트가 5000명 한정으로<br/> <HighlightText>결혼생활 진단을 <br/>무료로 제공 하고 있어요!</HighlightText><br/>간편 로그인 후 바로 진단 혜택을 받아보세요.
      </MessageTextRight>
      
      <MessageTextLeft2>
        <HighlightText>나의 감정 케어부터<br/>우리의 관계 관리까지</HighlightText><br/> 리커넥트는 더 나은 삶을 열기위한 필수앱입니다.
      </MessageTextLeft2>
    </Container>
  );
};

export default LoadingScreen;
