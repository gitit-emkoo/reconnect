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
  height: 80px;
  background: linear-gradient(to right, #FF69B4, #4169E1);
  border-radius: 30px;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  margin: 1.5rem 0 1rem;
  color: white;
  font-size: 1.2rem;
`;

const TemperatureCircle = styled.div`
  width: 70px;
  height: 70px;
  background: white;
  border-radius: 50%;
  position: absolute;
  right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FF1493;
  font-weight: bold;
  font-size: 1.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  span {
    font-size: 1rem;
    margin-left: 2px;
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
  if (temp < 36.5) return "더 자세한 내용과\n솔루션을 보고 싶다면\n회원가입 하세요!";
  if (temp < 37) return "더 자세한 내용과\n솔루션을 보고 싶다면\n회원가입 하세요!";
  return "더 자세한 내용과\n솔루션을 보고 싶다면\n회원가입 하세요!";
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
          우리 지금 이대로 괜찮은걸까...
          <TemperatureCircle>
            {temperature.toFixed(1)}<span>℃</span>
          </TemperatureCircle>
        </TemperatureBar>
        
        <PercentageText>
          우리 부부는 평균 부부의 <span>{percentageRank}</span>에 속해있습니다.
        </PercentageText>
        
        <Description>{description}</Description>

        <InviteButton onClick={() => navigate("/login")}>
          회원가입
        </InviteButton>
      </ContentSection>
    </Container>
  );
};

export default DiagnosisResult;