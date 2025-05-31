import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import BackButton from '../components/common/BackButton';
import ActionButton from '../components/common/ActionButton';
import img1 from '../assets/img1.jpg';

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

const getTemperatureDescription = (temp: number) => {
  if (temp < 36.5) return "더 자세한 내용과\n솔루션을 보고 싶다면\n로그인 하세요!";
  if (temp < 37) return "더 자세한 내용과\n솔루션을 보고 싶다면\n로그인 하세요!";
  return "더 자세한 내용과\n솔루션을 보고 싶다면\n로그인 하세요!";
};

const DiagnosisResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const answers: string[] = location.state?.answers || [];

  const yesCount = answers.filter((a) => a === "yes").length;
  const temperature = 36 + yesCount * 0.3;
  const description = getTemperatureDescription(temperature);

  // 나중에 온도에 따른 퍼센트 계산 로직 추가 예정
  const percentageRank = "상위 50%";

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
        <img src={img1} alt="Temperature illustration" />
      </ImageSection>
      
      <ContentSection>
        <Title>당신의 관계온도는</Title>
        <TemperatureBar>
          <TopSection>
            <TemperatureText>우리 지금 이대로 괜찮은걸까...</TemperatureText>
            <TemperatureValue>
              {temperature.toFixed(1)}<span>℃</span>
            </TemperatureValue>
          </TopSection>
          <TemperatureMeter temperature={temperature} />
        </TemperatureBar>
        
        <PercentageText>
          우리 부부는 평균 부부의 <span>{percentageRank}</span>에 속해있습니다.
        </PercentageText>
        
        <Description>{description}</Description>

        <InviteButton onClick={() => navigate("/welcome")}>
          로그인
        </InviteButton>
      </ContentSection>
    </Container>
  );
};

export default DiagnosisResult;