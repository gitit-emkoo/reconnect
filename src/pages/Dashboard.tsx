// src/pages/Dashboard.tsx (업데이트된 부분)
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import { isAuthenticated } from "../utils/auth";

const Container = styled.div`
  padding: 1.5rem;
  min-height: calc(100vh - 60px);
  background-color: #ffffff;
  padding-bottom: 80px;
`;

const WelcomeSection = styled.div`
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.p`
  color: #666;
  font-size: 1rem;
`;

const PartnerCard = styled.div<{ bgColor?: string }>`
  background-color: ${props => props.bgColor || '#FFB6C1'};
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  cursor: pointer;
`;

const PartnerInfo = styled.div`
  flex: 1;
`;

const PartnerName = styled.div`
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const PartnerTime = styled.div`
  font-size: 0.875rem;
  color: #666;
`;

const PartnerImageWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 0.5rem;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MenuCard = styled.div<{ disabled?: boolean }>`
  background-color: ${props => props.disabled ? '#f1f3f7' : '#2f3542'};
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  color: ${props => props.disabled ? '#666' : '#fff'};

  &:hover {
    background-color: ${props => props.disabled ? '#f1f3f7' : '#3d4453'};
  }
`;

const MenuTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const MenuText = styled.p`
  font-size: 0.875rem;
  opacity: 0.8;
`;

const RecommendedSection = styled.div`
  margin-top: 2rem;
`;

const RecommendedTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const RecommendedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
`;

const RecommendedCard = styled.div`
  background-color: #e8f5e9;
  border-radius: 1rem;
  padding: 1rem;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const RecommendedName = styled.div`
  font-size: 0.875rem;
  text-align: center;
`;

const RecommendedTime = styled.div`
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Logo = styled.img`
  width: 120px;
  height: auto;
`;

const MyPageButton = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isSolo, setIsSolo] = useState(true);
  const [userNickname, setUserNickname] = useState<string>("");

  useEffect(() => {
    // 인증 상태 확인
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // 사용자 닉네임 가져오기
    const nickname = localStorage.getItem('userNickname');
    if (nickname) {
      setUserNickname(nickname);
    }
  }, [navigate]);

  const handleFeatureClick = (path: string, requiresPartner: boolean = false) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (requiresPartner && isSolo) {
      alert("파트너와 연결 후 이용 가능한 기능입니다. 파트너를 초대해보세요!");
      navigate("/invite");
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <Container>
        <Header>
          <Logo src="/images/reconnect.png" alt="Reconnect Logo" />
          <MyPageButton onClick={() => navigate('/my')}>👤</MyPageButton>
        </Header>
        <WelcomeSection>
          <WelcomeTitle>{userNickname}님, 반가워요!</WelcomeTitle>
          <WelcomeSubtitle>We Wish you have a good day</WelcomeSubtitle>
        </WelcomeSection>

        {!isSolo && (
          <PartnerCard bgColor="#FFE4B5">
            <PartnerInfo>
              <PartnerName>배우자</PartnerName>
              <PartnerTime>3-10 MIN</PartnerTime>
            </PartnerInfo>
            <PartnerImageWrapper>
              <img src="/images/husband.jpg" alt="Partner" />
            </PartnerImageWrapper>
          </PartnerCard>
        )}

        <MenuCard disabled={isSolo} onClick={() => handleFeatureClick("/calendar", true)}>
          <MenuTitle>Daily Thought</MenuTitle>
          <MenuText>MEDITATION • 3-10 MIN</MenuText>
        </MenuCard>

        <MenuCard disabled={isSolo} onClick={() => handleFeatureClick("/emotion-card", true)}>
          <MenuTitle>감정카드</MenuTitle>
          <MenuText>오늘의 감정을 카드에 담아보세요</MenuText>
        </MenuCard>

        <MenuCard onClick={() => handleFeatureClick("/emotion-diary")}>
          <MenuTitle>감정일기</MenuTitle>
          <MenuText>오늘의 감정을 기록해보세요</MenuText>
        </MenuCard>

        <RecommendedSection>
          <RecommendedTitle>Recommended for you</RecommendedTitle>
          <RecommendedGrid>
            <RecommendedCard>
              <RecommendedName>Focus</RecommendedName>
              <RecommendedTime>MEDITATION • 3-10 MIN</RecommendedTime>
            </RecommendedCard>
            <RecommendedCard>
              <RecommendedName>Happiness</RecommendedName>
              <RecommendedTime>MEDITATION • 3-10 MIN</RecommendedTime>
            </RecommendedCard>
          </RecommendedGrid>
        </RecommendedSection>

        {/* 테스트용 버튼 */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            onClick={() => setIsSolo(!isSolo)}
            style={{
              background: "#60a5fa",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            {isSolo ? "파트너 모드로 전환" : "혼자 사용 모드로 전환"} (테스트용)
          </button>
        </div>
      </Container>
      <NavigationBar />
    </>
  );
};

export default Dashboard;
