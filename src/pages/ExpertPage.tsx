// src/pages/ExpertPage.tsx
import React from 'react';
import styled from 'styled-components';
import NavigationBar from "../components/NavigationBar"; // NavigationBar 임포트

const Container = styled.div`
  padding: 2rem;
  min-height: calc(100vh - 60px);
  background-color: #f8fcf5; /* 밝은 녹색 계열 */
  padding-bottom: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #2e8b57;
  margin-bottom: 1.5rem;
`;

const Text = styled.p`
  font-size: 1.1rem;
  color: #3cb371;
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 600px;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: #2e8b57;
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const CTAButton = styled.button`
  background-color: #3cb371;
  color: white;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background-color: #2e8b57;
  }
`;

const ExpertPage: React.FC = () => {
  return (
    <>
      <Container>
        <Title>전문가와 함께하는 여정 💚</Title>
        <Text>
          관계 전문가들의 깊이 있는 통찰과 개인 맞춤형 솔루션을 통해
          당신의 관계를 한 단계 더 발전시키세요.
        </Text>
        <SectionTitle>제공 서비스</SectionTitle>
        <Text>
          * 1:1 심리 상담
          <br />
          * 관계 코칭 프로그램
          <br />
          * 맞춤형 관계 개선 로드맵
        </Text>
        <CTAButton style={{ marginTop: '2.5rem' }} onClick={() => alert("전문가 상담 예약 페이지로 이동")}>
          전문가 상담 신청하기
        </CTAButton>
      </Container>
      <NavigationBar />
    </>
  );
};

export default ExpertPage;