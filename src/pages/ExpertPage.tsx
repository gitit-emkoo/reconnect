// src/pages/ExpertPage.tsx
import React from 'react';
import styled from 'styled-components';
import NavigationBar from "../components/NavigationBar"; // NavigationBar 임포트
import Header from '../components/common/Header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 60px);
  background: white;
  padding: 2rem;
  padding-bottom: 80px;
  justify-content: center;
  text-align: center;
`;


const Text = styled.p`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 600px;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: #78350f;
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const CTAButton = styled.button`
  background: linear-gradient(to right, #FF69B4, #4169E1);
  color: white;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  &:hover {
    opacity: 0.9;
  }
`;

const ExpertPage: React.FC = () => {
  return (
    <>
      <Header title="전문가" />
      <Container>
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
          <br />
          지금 준비중입니다.
        </Text>
        <CTAButton style={{ marginTop: '2.5rem' }} onClick={() => alert("전문가 상담 예약 페이지로 이동")}>홈으로 돌아가기</CTAButton>
      </Container>
      <NavigationBar />
    </>
  );
};

export default ExpertPage;