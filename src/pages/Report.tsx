import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background-color: #f9fafb;
  min-height: 100vh;
  padding: 2rem;
`;

const Section = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Metric = styled.p`
  font-size: 1rem;
  color: #4b5563;
  margin: 0.25rem 0;
`;

const Highlight = styled.span`
  font-weight: bold;
  color: #0ea5e9;
`;

const CTA = styled.button`
  display: block;
  width: 100%;
  margin-top: 1rem;
  padding: 1rem;
  background-color: #0ea5e9;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  &:hover {
    background-color: #0284c7;
  }
`;

const Report: React.FC = () => {
  const relationTemp = 37.2;
  const emotionShares = 4;
  const missionCount = 2;

  return (
    <Container>
      <Section>
        <Title>이번 주 리포트 📊</Title>
        <Metric>
          관계 온도: <Highlight>{relationTemp.toFixed(1)}℃</Highlight>
        </Metric>
        <Metric>
          감정 나눔 횟수: <Highlight>{emotionShares}회</Highlight>
        </Metric>
        <Metric>
          미션 수행 횟수: <Highlight>{missionCount}회</Highlight>
        </Metric>
        <CTA onClick={() => alert("전문가 솔루션 유도 (유료 진입)")}>전문가 솔루션 보기</CTA>
      </Section>
    </Container>
  );
};

export default Report;
