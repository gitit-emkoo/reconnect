// src/pages/Dashboard.tsx (업데이트된 부분)
import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar"; // NavigationBar 임포트

const Container = styled.div`
  padding: 2rem;
  min-height: calc(100vh - 60px); /* NavigationBar 높이만큼 줄임 */
  background-color: #ecfdf5;
  padding-bottom: 80px; /* NavigationBar에 가려지지 않도록 하단 패딩 추가 */
`;

const Section = styled.div`
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
`;

const Text = styled.p`
  color: #4b5563;
  font-size: 1rem;
`;

const CTAButton = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  margin-top: 1rem;
  &:hover {
    background-color: #2563eb;
  }
`;

const FeatureDisabledMessage = styled.p`
  color: #ef4444;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  // 이 상태는 실제 앱에서는 사용자 데이터에 따라 결정되어야 합니다.
  const [isSolo, setIsSolo] = useState(true); // 초기값: 혼자 사용 모드 (테스트용)

  const handleFeatureClick = (path: string, requiresPartner: boolean = false) => {
    if (requiresPartner && isSolo) {
      alert("파트너와 연결 후 이용 가능한 기능입니다. 파트너를 초대해보세요!");
      navigate("/invite");
    } else {
      navigate(path);
    }
  };

  return (
    <> {/* Fragment로 감싸서 NavigationBar와 함께 렌더링 */}
      <Container>
        {isSolo ? (
          <>
            <Section>
              <Title>혼자 시작한 당신의 공간</Title>
              <Text>
                파트너와 아직 연결되지 않았지만, 지금부터 당신의 감정을 기록하고
                되돌아볼 수 있어요.
              </Text>
            </Section>
            <Section>
              <Title>감정카드 작성</Title>
              <Text>감정카드를 통해 마음을 표현해보세요.</Text>
              <CTAButton onClick={() => handleFeatureClick("/emotion-card")}>
                감정카드 작성
              </CTAButton>
            </Section>
            <Section>
              <Title>감정 일기</Title>
              <Text>매일의 감정을 기록하고 돌아보세요.</Text>
              <CTAButton onClick={() => handleFeatureClick("/emotion-diary")}>
                감정 일기 쓰기
              </CTAButton>
            </Section>
            <Section>
              <Title>파트너 초대하기</Title>
              <Text>파트너를 초대하고 싶다면 아래 버튼을 눌러보세요.</Text>
              <CTAButton onClick={() => navigate("/invite")}>
                파트너 초대
              </CTAButton>
            </Section>

            {/* 파트너와 함께하는 기능은 비활성화 상태로 표시 */}
            <Section>
              <Title>이번 주 연결 미션</Title>
              <Text>파트너와 연결 후 이용 가능한 기능입니다.</Text>
              <FeatureDisabledMessage>
                🔒 파트너 초대 후 활성화됩니다.
              </FeatureDisabledMessage>
            </Section>
            <Section>
              <Title>관계 온도</Title>
              <Text>파트너와 연결 후 이용 가능한 기능입니다.</Text>
              <FeatureDisabledMessage>
                🔒 파트너 초대 후 활성화됩니다.
              </FeatureDisabledMessage>
            </Section>
            <Section>
              <Title>맞춤 콘텐츠 추천</Title>
              <Text>파트너와 연결 후 이용 가능한 기능입니다.</Text>
              <FeatureDisabledMessage>
                🔒 파트너 초대 후 활성화됩니다.
              </FeatureDisabledMessage>
            </Section>
            <Section>
              <Title>나의 연결 캘린더</Title>
              <Text>파트너와 연결 후 이용 가능한 기능입니다.</Text>
              <FeatureDisabledMessage>
                🔒 파트너 초대 후 활성화됩니다.
              </FeatureDisabledMessage>
            </Section>
            <Section>
              <Title>커뮤니티</Title>
              <Text>파트너와 연결 후 이용 가능한 기능입니다.</Text>
              <FeatureDisabledMessage>
                🔒 파트너 초대 후 활성화됩니다.
              </FeatureDisabledMessage>
            </Section>
            <Section>
              <Title>마이 페이지</Title>
              <Text>내 정보와 설정을 관리합니다.</Text>
              {/* 마이페이지는 혼자 사용 모드에서도 접근 가능하므로 비활성화 메시지 없음 */}
              <CTAButton onClick={() => handleFeatureClick("/my")}>
                마이 페이지로 이동
              </CTAButton>
            </Section>
          </>
        ) : (
          <>
            {/* 파트너와 함께하는 모드 UI */}
            <Section>
              <Title>오늘의 감정카드</Title>
              <Text>상대방이 감정카드를 아직 작성하지 않았어요.</Text>
              <CTAButton onClick={() => handleFeatureClick("/emotion-card")}>
                내 감정카드 작성하기
              </CTAButton>
            </Section>
            <Section>
              <Title>감정 일기</Title>
              <Text>오늘의 감정을 기록해보세요.</Text>
              <CTAButton onClick={() => handleFeatureClick("/emotion-diary")}>
                감정 일기 쓰기
              </CTAButton>
            </Section>
            <Section>
              <Title>이번 주 연결 미션</Title>
              <Text>함께 저녁 만들기 🍳 (2일 남음)</Text>
              <CTAButton onClick={() => handleFeatureClick("/challenge")}>
                미션 보러가기
              </CTAButton>
            </Section>
            <Section>
              <Title>관계 온도</Title>
              <Text>현재 온도: 37.2℃ — 안정적인 거리입니다.</Text>
              <CTAButton onClick={() => handleFeatureClick("/report")}>
                자세히 보기
              </CTAButton>
            </Section>
            <Section>
              <Title>맞춤 콘텐츠 추천</Title>
              <Text>파트너와 함께 성장을 위한 맞춤 콘텐츠를 만나보세요.</Text>
              <CTAButton onClick={() => handleFeatureClick("/content-center")}>
                콘텐츠 보러가기
              </CTAButton>
            </Section>
            <Section>
              <Title>나의 연결 캘린더</Title>
              <Text>중요한 연결 이벤트들을 기록하고 확인하세요.</Text>
              <CTAButton onClick={() => handleFeatureClick("/calendar")}>
                캘린더 열기
              </CTAButton>
            </Section>
            <Section>
              <Title>커뮤니티</Title>
              <Text>다른 사용자들과 소통하고 경험을 공유해보세요.</Text>
              <CTAButton onClick={() => handleFeatureClick("/community")}>
                커뮤니티 참여
              </CTAButton>
            </Section>
            <Section>
              <Title>마이 페이지</Title>
              <Text>내 정보와 설정을 관리합니다.</Text>
              <CTAButton onClick={() => handleFeatureClick("/my")}>
                마이 페이지로 이동
              </CTAButton>
            </Section>
          </>
        )}
        {/* 테스트용 isSolo 전환 버튼 */}
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
      {/* NavigationBar를 컴포넌트 하단에 렌더링 */}
      <NavigationBar isSolo={isSolo} />
    </>
  );
};

export default Dashboard;
