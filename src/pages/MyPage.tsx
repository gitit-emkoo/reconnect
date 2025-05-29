// src/pages/MyPage.tsx
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background-color: #fbf7f0; /* 밝은 베이지 계열 */
  min-height: 100vh;
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #a0522d; /* 테라코타 계열 */
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Section = styled.div`
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  color: #8b4513; /* 새들브라운 계열 */
  margin-bottom: 1rem;
`;

const InfoItem = styled.p`
  font-size: 1rem;
  color: #5a3a2a;
  margin-bottom: 0.5rem;
  strong {
    font-weight: 600;
  }
`;

const Button = styled.button`
  background-color: #cd853f; /* 페루색 */
  color: white;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  margin-top: 1rem;
  &:hover {
    background-color: #b87a3e;
  }
`;

const MyPage: React.FC = () => {
  // 더미 사용자 정보
  const userName = "테스트님";
  const partnerName = "배우자님";
  const email = "test@example.com";
  const subscriptionStatus = "프리미엄 (만료일: 2025.12.31)";

  return (
    <Container>
      <Title>마이 페이지 👤</Title>
      <Section>
        <SectionTitle>내 정보</SectionTitle>
        <InfoItem>
          <strong>이름:</strong> {userName}
        </InfoItem>
        <InfoItem>
          <strong>연결된 파트너:</strong> {partnerName}
        </InfoItem>
        <InfoItem>
          <strong>이메일:</strong> {email}
        </InfoItem>
        <InfoItem>
          <strong>구독 상태:</strong> {subscriptionStatus}
        </InfoItem>
        <Button>정보 수정</Button>
      </Section>

      <Section>
        <SectionTitle>설정</SectionTitle>
        <Button style={{ marginRight: '1rem' }}>알림 설정</Button>
        <Button>비밀번호 변경</Button>
      </Section>

      <Section>
        <SectionTitle>기타</SectionTitle>
        <Button style={{ marginRight: '1rem' }}>자주 묻는 질문</Button>
        <Button>로그아웃</Button>
      </Section>
    </Container>
  );
};

export default MyPage;